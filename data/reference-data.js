window.PRINTPROFIT_REFERENCE_DATA={
  "version": 1,
  "currency": "GBP",
  "timezone": "Europe/London",
  "platformProfiles": {
    "own": {
      "platform": 0,
      "pay": 0,
      "fixed": 0,
      "note": "Direct sale / own website: no marketplace fee preloaded."
    },
    "etsy": {
      "platform": 6.98,
      "pay": 4,
      "fixed": 0.2,
      "note": "Etsy UK: 6.5% transaction + 0.48% UK regulatory fee; Etsy Payments 4% + £0.20. Reference value; not yet checked by the nightly updater."
    },
    "ebay": {
      "platform": 12.25,
      "pay": 0,
      "fixed": 0.4,
      "note": "eBay UK Business default: 11.9% Home/Furniture & DIY + 0.35% regulatory fee; £0.40 per order over £10. Reference value; not yet checked by the nightly updater."
    },
    "amazon": {
      "platform": 12.24,
      "pay": 0,
      "fixed": 0,
      "note": "Amazon Handmade UK: 12.24% referral fee. Monthly selling-plan cost is not allocated per sale here. Reference value; not yet checked by the nightly updater."
    },
    "depop": {
      "platform": 0,
      "pay": 2.9,
      "fixed": 0.3,
      "note": "Depop UK: no selling fee; Depop Payments 2.9% + £0.30. Boosted Listings are not included. Reference value; not yet checked by the nightly updater."
    },
    "vinted": {
      "platform": 0,
      "pay": 0,
      "fixed": 0,
      "note": "Vinted UK: standard seller transaction fee is £0; buyer protection is charged to the buyer. Reference value; not yet checked by the nightly updater."
    },
    "tiktok": {
      "platform": 9,
      "pay": 0,
      "fixed": 0,
      "note": "TikTok Shop UK: standard commission 9%; category/programme reductions or extra fees may apply. Reference value; not yet checked by the nightly updater."
    },
    "facebook": {
      "platform": 0,
      "pay": 0,
      "fixed": 0,
      "note": "Facebook Marketplace: £0 transaction fee assumed for direct/local selling; checkout or promotional charges may vary. Reference value; not yet checked by the nightly updater."
    },
    "gumtree": {
      "platform": 0,
      "pay": 0,
      "fixed": 0,
      "note": "Gumtree: no per-sale fee preloaded; paid listing or promotion options may apply. Reference value; not yet checked by the nightly updater."
    },
    "folksy": {
      "platform": 7.2,
      "pay": 1.5,
      "fixed": 0.2,
      "note": "Folksy Basic: 6% commission + VAT = 7.2%; Stripe standard UK card rate shown as 1.5% + £0.20. Reference value; not yet checked by the nightly updater."
    },
    "shopify": {
      "platform": 0,
      "pay": 2,
      "fixed": 0.25,
      "note": "Shopify Payments Basic: 2% + £0.25 standard online card rate. Monthly plan cost is not allocated per sale. Reference value; not yet checked by the nightly updater."
    },
    "custom": {
      "platform": 0,
      "pay": 0,
      "fixed": 0,
      "note": "Enter your own platform and payment fees."
    }
  },
  "deliveryProfiles": {
    "royalmail": {
      "source": "Royal Mail published UK consumer reference rates — existing reference; not yet checked by the nightly updater",
      "rates": [
        {
          "label": "2nd Class Letter — £1.55",
          "price": 1.55,
          "note": "Up to 100g."
        },
        {
          "label": "2nd Class Large Letter — £2.80",
          "price": 2.8,
          "note": "Up to 750g."
        },
        {
          "label": "2nd Class Small Parcel — £3.95",
          "price": 3.95,
          "note": "Up to 2kg."
        },
        {
          "label": "2nd Class Medium Parcel — £6.25",
          "price": 6.25,
          "note": "Up to 20kg."
        },
        {
          "label": "1st Class Letter — £3.05",
          "price": 3.05,
          "note": "Up to 100g."
        },
        {
          "label": "1st Class Large Letter — £3.70",
          "price": 3.7,
          "note": "Up to 750g."
        },
        {
          "label": "1st Class Small Parcel — £5.05",
          "price": 5.05,
          "note": "Up to 2kg."
        },
        {
          "label": "1st Class Medium Parcel — £8.95",
          "price": 8.95,
          "note": "Up to 20kg."
        }
      ]
    },
    "evri": {
      "source": "Evri published UK parcel reference rates — existing reference; not yet checked by the nightly updater",
      "rates": [
        {
          "label": "Standard drop-off — up to 1kg — £2.62",
          "price": 2.62,
          "note": "Locker/shop drop-off reference."
        },
        {
          "label": "Standard drop-off — 1–2kg — £3.29",
          "price": 3.29,
          "note": "Locker/shop drop-off reference."
        },
        {
          "label": "Standard drop-off — 2–5kg — £4.10",
          "price": 4.1,
          "note": "Locker/shop drop-off reference."
        },
        {
          "label": "Standard drop-off — 5–10kg — £5.28",
          "price": 5.28,
          "note": "Locker/shop drop-off reference."
        },
        {
          "label": "Standard collection — 1–2kg Standard — £5.78",
          "price": 5.78,
          "note": "Collection price; location charges may apply."
        },
        {
          "label": "Standard collection — 2–5kg — £7.58",
          "price": 7.58,
          "note": "Collection price; location charges may apply."
        },
        {
          "label": "Standard collection — 5–10kg — £7.68",
          "price": 7.68,
          "note": "Collection price; location charges may apply."
        },
        {
          "label": "Standard collection — 10–15kg — £11.29",
          "price": 11.29,
          "note": "Collection price; location charges may apply."
        }
      ]
    },
    "inpost": {
      "source": "InPost parcel price list (current) — existing reference; not yet checked by the nightly updater",
      "rates": [
        {
          "label": "Locker / Shop — Small — £1.99",
          "price": 1.99,
          "note": "Up to 15kg; 8 × 38 × 64cm."
        },
        {
          "label": "Locker / Shop — Medium — £2.59",
          "price": 2.59,
          "note": "Up to 15kg; 19 × 38 × 64cm."
        },
        {
          "label": "Locker / Shop — Large — £3.99",
          "price": 3.99,
          "note": "Up to 15kg; 41 × 38 × 64cm."
        },
        {
          "label": "Home address — Small — £2.89",
          "price": 2.89,
          "note": "Up to 15kg; 8 × 38 × 64cm."
        },
        {
          "label": "Home address — Medium — £3.99",
          "price": 3.99,
          "note": "Up to 15kg; 19 × 38 × 64cm."
        },
        {
          "label": "Home address — Large — £5.99",
          "price": 5.99,
          "note": "Up to 15kg; 41 × 38 × 64cm."
        }
      ]
    },
    "dpd": {
      "source": "DPD Online published UK starting prices — existing reference; not yet checked by the nightly updater",
      "rates": [
        {
          "label": "UK drop-off — from £2.99",
          "price": 2.99,
          "note": "Starting price; exact quote depends on parcel details."
        },
        {
          "label": "UK collection — from £5.81",
          "price": 5.81,
          "note": "Starting price; exact quote depends on parcel details."
        }
      ]
    },
    "dhl": {
      "source": "DHL eCommerce UK published price — existing reference; not yet checked by the nightly updater",
      "rates": [
        {
          "label": "UK delivery — from £2.79",
          "price": 2.79,
          "note": "Includes VAT; mainland depot drop-off/collection basis."
        }
      ]
    },
    "parcelforce": {
      "source": "Parcelforce UK retail prices from 7 April 2026 — existing reference; not yet checked by the nightly updater",
      "rates": [
        {
          "label": "express48 — from £11.95",
          "price": 11.95,
          "note": "Up to 30kg; tracked."
        },
        {
          "label": "express24 — from £12.50",
          "price": 12.5,
          "note": "Up to 30kg; tracked."
        },
        {
          "label": "expressAM — from £16.50",
          "price": 16.5,
          "note": "Up to 30kg; next working day by noon."
        },
        {
          "label": "express10 — from £28.10",
          "price": 28.1,
          "note": "Up to 30kg; next working day by 10am."
        },
        {
          "label": "express48large — from £51.65",
          "price": 51.65,
          "note": "Large parcel service."
        }
      ]
    },
    "ups": {
      "source": "UPS UK public rate guidance — existing reference; not yet checked by the nightly updater",
      "rates": [
        {
          "label": "Domestic UK — quote required",
          "price": 0,
          "note": "Enter your quoted UPS rate in Cost to you."
        }
      ]
    },
    "fedex": {
      "source": "FedEx UK rates effective 5 January 2026 — existing reference; not yet checked by the nightly updater",
      "rates": [
        {
          "label": "Domestic UK — quote required",
          "price": 0,
          "note": "Enter your quoted FedEx rate in Cost to you."
        }
      ]
    },
    "custom": {
      "source": "Manual entry",
      "rates": [
        {
          "label": "Manual rate — enter below",
          "price": 0,
          "note": "Use your own business, account or negotiated shipping rate."
        }
      ]
    }
  },
  "electricity": {
    "providers": [
      [
        "British Gas",
        "British Gas Trading Ltd"
      ],
      [
        "E.ON Next",
        "E.ON Next Energy Ltd"
      ],
      [
        "EDF Energy",
        "EDF Energy Customers Ltd"
      ],
      [
        "Octopus Energy",
        "Octopus Energy Ltd"
      ],
      [
        "OVO Energy",
        "OVO Energy Ltd"
      ],
      [
        "ScottishPower",
        "Scottish Power Energy Retail Ltd"
      ],
      [
        "Utilita Energy",
        "Utilita Energy Ltd"
      ],
      [
        "Ecotricity",
        "Ecotricity Ltd"
      ],
      [
        "Good Energy",
        "Good Energy Ltd"
      ],
      [
        "So Energy",
        "So Energy Trading Ltd"
      ],
      [
        "Utility Warehouse",
        "Electricity Plus Supply Ltd"
      ],
      [
        "E (Gas & Electricity)",
        "E (Gas and Electricity) Ltd"
      ],
      [
        "Fuse Energy",
        "Fuse Energy Supply Ltd"
      ],
      [
        "Foxglove Energy",
        "Foxglove Energy Supply Ltd"
      ],
      [
        "Green Energy UK",
        "Green Energy (UK) Ltd"
      ],
      [
        "Drax",
        "Drax Energy Solutions Ltd"
      ],
      [
        "Valda Energy",
        "Valda Energy Ltd"
      ],
      [
        "Voltx Power",
        "Voltx Power Ltd"
      ],
      [
        "Tru Energy",
        "Tru Energy Ltd"
      ],
      [
        "Square1 Energy",
        "Square1 Energy Ltd"
      ],
      [
        "Arto.Energy",
        "Arto.Energy Ltd"
      ],
      [
        "Brook Green",
        "Brook Green Trading Ltd"
      ],
      [
        "Bryt Energy",
        "Bryt Energy Ltd"
      ],
      [
        "Co-op Energy",
        "Co-operative Energy Ltd"
      ],
      [
        "Evolve Energy",
        "Evolve Energy Supply Ltd"
      ],
      [
        "Home Energy Trading",
        "Home Energy Trading Ltd"
      ],
      [
        "Highland Electricity",
        "Highland Electricity Ltd"
      ],
      [
        "Jellyfish Energy",
        "Jellyfish Energy Ltd"
      ],
      [
        "Planet 9 Energy",
        "Planet 9 Energy Ltd"
      ],
      [
        "Shell Energy",
        "Shell Energy UK Ltd"
      ],
      [
        "SINQ Power",
        "SINQ Power Ltd"
      ],
      [
        "Toucan Energy",
        "Toucan Energy Ltd"
      ],
      [
        "Unify Energy",
        "Unify Energy Ltd"
      ],
      [
        "YU Energy",
        "YU Energy Retail Ltd"
      ],
      [
        "D-ENERGI",
        "D-Energi Trading Ltd"
      ],
      [
        "DGP Energy",
        "DGP Energy Ltd"
      ],
      [
        "Digital Power",
        "Digital Power Energy Supply UK Ltd"
      ],
      [
        "Eneco",
        "Eneco Energy Trade BV"
      ],
      [
        "ENGIE",
        "Engie Power Ltd"
      ],
      [
        "Electroroute",
        "Electroroute Energy Ltd"
      ],
      [
        "AXPO UK",
        "AXPO UK Ltd"
      ],
      [
        "Corona Energy",
        "Corona Energy Retail 4 Ltd"
      ],
      [
        "Hartree Partners",
        "Hartree Partners Supply (UK) Ltd"
      ],
      [
        "Marble Power",
        "Marble Power Ltd"
      ],
      [
        "Maxen Power",
        "Maxen Power Supply Ltd"
      ],
      [
        "MVV Environment",
        "MVV Environment Services Ltd"
      ],
      [
        "NEAS Energy",
        "NEAS Energy Ltd"
      ],
      [
        "Opus Energy",
        "Opus Energy Ltd"
      ],
      [
        "SQE Energy",
        "SQE Energy Ltd"
      ],
      [
        "Tesla Energy",
        "Tesla Energy Ventures Ltd"
      ],
      [
        "United Gas & Power",
        "United Gas & Power Trading Ltd"
      ],
      [
        "Constellation Generation",
        "Constellation Generation Ltd"
      ],
      [
        "Alfred Electricity & Gas",
        "Alfred Electricity & Gas Ltd"
      ],
      [
        "Barbican Power",
        "Barbican Power Ltd"
      ],
      [
        "BGI",
        "BGI Trading Ltd"
      ],
      [
        "BP Gas & Power",
        "BP Gas Marketing Ltd"
      ],
      [
        "Capture Energy",
        "Capture Energy Ltd"
      ],
      [
        "Conrad Energy",
        "Conrad Energy (Trading) Ltd"
      ],
      [
        "Coulomb Energy",
        "Coulomb Energy Supply Ltd"
      ],
      [
        "Crown Gas & Power",
        "Crown Gas and Power 2 Ltd"
      ],
      [
        "Dyce Energy",
        "Dyce Energy Ltd"
      ],
      [
        "E E Solutions",
        "E E Solutions Ltd"
      ],
      [
        "Edgware Energy",
        "Edgware Energy Ltd"
      ],
      [
        "Engelhart CTP Energy UK",
        "Engelhart CTP Energy UK Ltd"
      ],
      [
        "EPG Energy",
        "EPG Energy Ltd"
      ],
      [
        "Equinicity",
        "Equinicity Ltd"
      ],
      [
        "F & S Energy",
        "F & S Energy Ltd"
      ],
      [
        "Farringdon Energy",
        "Farringdon Energy Ltd"
      ],
      [
        "Flexitricity",
        "Flexitricity Ltd"
      ],
      [
        "Habitat Energy",
        "Habitat Energy Ltd"
      ],
      [
        "Holborn Energy",
        "Holborn Energy Ltd"
      ],
      [
        "Limejump Energy",
        "Limejump Energy Ltd"
      ],
      [
        "Nadara Energy Trading",
        "Nadara Energy Trading Srl, UK Branch"
      ],
      [
        "npower Business Solutions",
        "Npower Commercial Gas Ltd"
      ],
      [
        "Pozitive Energy",
        "Pozitive Energy Ltd"
      ],
      [
        "PX Supply",
        "PX Supply Ltd"
      ],
      [
        "Radius Energy",
        "Radius Energy Ltd"
      ],
      [
        "Regent Power",
        "Regent Power Ltd"
      ],
      [
        "Ruby Energy",
        "Ruby Electricity Ltd"
      ],
      [
        "SEFE Energy",
        "Sefe Energy Ltd"
      ],
      [
        "Smart Pay Energy",
        "Smart Pay Energy Ltd"
      ],
      [
        "SmartestEnergy",
        "SmartestEnergy Ltd"
      ],
      [
        "SSE",
        "SSE Energy Supply Ltd"
      ],
      [
        "Statkraft",
        "Statkraft Markets GmbH"
      ],
      [
        "TotalEnergies Gas & Power",
        "TotalEnergies Gas & Power Ltd"
      ],
      [
        "Tradelink Solutions",
        "Tradelink Solutions Ltd"
      ],
      [
        "UC Energy",
        "UC Energy Ltd"
      ],
      [
        "UK Power Reserve",
        "UK Power Reserve Ltd"
      ],
      [
        "United Gas & Power",
        "United Gas & Power Ltd"
      ],
      [
        "Vattenfall",
        "Vattenfall Energy Trading GmbH"
      ],
      [
        "Verastar",
        "Verastar Ltd"
      ],
      [
        "Versa Energy",
        "Versa Energy Ltd"
      ],
      [
        "Wilton Energy",
        "Wilton Energy Ltd"
      ],
      [
        "Custom / Other",
        ""
      ]
    ],
    "benchmarks": [
      {
        "id": "ofgem-jul-sep-2026",
        "label": "Ofgem reference: July–September 2026",
        "validFrom": "2026-07-01",
        "validTo": "2026-09-30",
        "rate": 0.2611,
        "standing": 0.5719
      },
      {
        "id": "ofgem-oct-dec-2026",
        "label": "Ofgem reference: October–December 2026",
        "validFrom": "2026-10-01",
        "validTo": "2026-12-31",
        "rate": 0.2632,
        "standing": 0.5483
      }
    ],
    "note": "Great Britain average direct debit reference, including VAT. Supplier tariffs need a postcode, meter and payment method. Northern Ireland is outside the Ofgem price cap."
  },
  "sourceStatus": {}
};
