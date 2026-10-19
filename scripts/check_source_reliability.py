"""Regression checks for transient retries and expiring manual references."""
import copy
import json
import tempfile
import unittest
import urllib.error
from email.message import Message
from pathlib import Path
from unittest.mock import MagicMock, patch
from nightly_network import Reader
from nightly_manual_references import apply

class ReliabilityChecks(unittest.TestCase):
    def test_transient_500_recovers_with_bounded_backoff(self):
        reader=Reader()
        response=MagicMock()
        response.__enter__.return_value=response
        response.read.return_value=b'OK'
        response.headers=Message()
        response.geturl.return_value='https://retailer.example/products.json'
        error=urllib.error.HTTPError(response.geturl.return_value,500,'Temporary',{},None)
        reader.opener.open=MagicMock(side_effect=[error,error,response])
        with patch('nightly_network.public_url',side_effect=lambda url:url), patch('nightly_network.time.sleep') as sleep:
            self.assertEqual(reader._read(response.geturl.return_value,100)[0],b'OK')
        self.assertEqual(reader.opener.open.call_count,3)
        self.assertTrue(any(call.args[0]>=10 for call in sleep.call_args_list))

    def test_forbidden_is_not_retried(self):
        reader=Reader()
        reader.opener.open=MagicMock(side_effect=urllib.error.HTTPError('https://retailer.example',403,'Forbidden',{},None))
        with patch('nightly_network.public_url',side_effect=lambda url:url), patch('nightly_network.time.sleep'):
            with self.assertRaises(urllib.error.HTTPError):reader._read('https://retailer.example',100)
        self.assertEqual(reader.opener.open.call_count,1)

    def test_manual_check_expires_and_cannot_replace_newer_automatic_check(self):
        entry={'group':'platformProfiles','id':'test','checkedAt':'2026-10-19','reviewAfter':'2026-10-26','sourceIds':['test'],'sourceUrls':['https://official.example/rates'],'value':{'platform':2,'pay':0,'fixed':0,'note':'UK base fee.'}}
        original={'platformProfiles':{'test':{'platform':1}},'sourceStatus':{'test':{'status':'failed','error':'Blocked'}}}
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);(root/'config').mkdir()
            (root/'config/reference-verifications.json').write_text(json.dumps({'entries':[entry]}))
            ref=copy.deepcopy(original);apply(ref,root,'2026-10-19')
            self.assertEqual(ref['platformProfiles']['test']['platform'],2)
            self.assertEqual(ref['sourceStatus']['test']['automaticStatus'],'failed')
            ref=copy.deepcopy(original);apply(ref,root,'2026-10-27')
            self.assertEqual(ref,original)
            ref=copy.deepcopy(original);ref['sourceStatus']['test']={'status':'verified','lastVerified':'2026-10-20'}
            apply(ref,root,'2026-10-20')
            self.assertEqual(ref['platformProfiles']['test']['platform'],1)

if __name__=='__main__':unittest.main()
