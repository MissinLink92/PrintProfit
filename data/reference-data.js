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
      "note": "Amazon Handmade UK. Monthly plan costs are not allocated per sale. Platform 12.24%; payments 0% + £0.00. Checked 2026-10-04.",
      "checkedAt": "2026-10-04",
      "sourceUrls": [
        "https://sell.amazon.co.uk/programmes/handmade"
      ]
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
      "note": "Gumtree UK seller payment fees; paid business listings and promotions excluded. Platform 0%; payments 0% + £0.00. Checked 2026-10-04.",
      "checkedAt": "2026-10-04",
      "sourceUrls": [
        "https://www.gumtree.com/info/safety/p/payments/how-fees-and-selling-costs-are-charged/"
      ]
    },
    "folksy": {
      "platform": 7.2,
      "pay": 1.5,
      "fixed": 0.2,
      "note": "Folksy Basic: 6% commission + VAT = 7.2%; Stripe standard UK card rate shown as 1.5% + £0.20. Reference value; not yet checked by the nightly updater."
    },
    "shopify": {
      "platform": 0,
      "pay": 2.0,
      "fixed": 0.25,
      "note": "Shopify Payments Basic standard online UK cards. Monthly plan costs are not allocated per sale. Platform 0%; payments 2.0% + £0.25. Checked 2026-10-04.",
      "checkedAt": "2026-10-04",
      "sourceUrls": [
        "https://www.shopify.com/uk/pricing"
      ]
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
      "source": "Evri official UK reference — checked 2026-10-04",
      "rates": [
        {
          "label": "Home/work — Postable (Under 1kg) — Standard drop off",
          "price": 2.7,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — Postable (Under 1kg) — Next Day drop off",
          "price": 3.49,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 0-1kg Small — Standard drop off",
          "price": 3.04,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 0-1kg Small — Next Day drop off",
          "price": 3.9,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 0-1kg Small — Standard collection",
          "price": 4.04,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 0-1kg Standard — Standard drop off",
          "price": 3.29,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 0-1kg Standard — Next Day drop off",
          "price": 4.12,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 0-1kg Standard — Standard collection",
          "price": 4.3,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 1-2kg Small — Standard drop off",
          "price": 3.52,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 1-2kg Small — Next Day drop off",
          "price": 4.6,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 1-2kg Small — Standard collection",
          "price": 4.52,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 1kg-2kg Standard — Standard drop off",
          "price": 4.79,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 1kg-2kg Standard — Next Day drop off",
          "price": 5.48,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 1kg-2kg Standard — Standard collection",
          "price": 5.78,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 2kg-5kg — Standard drop off",
          "price": 6.59,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 2kg-5kg — Next Day drop off",
          "price": 7.55,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 2kg-5kg — Standard collection",
          "price": 7.58,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 5kg-10kg — Standard drop off",
          "price": 6.68,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 5kg-10kg — Next Day drop off",
          "price": 7.72,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 5kg-10kg — Standard collection",
          "price": 7.68,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 10kg-15kg — Standard drop off",
          "price": 10.28,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 10kg-15kg — Next Day drop off",
          "price": 12.35,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "Home/work — 10kg-15kg — Standard collection",
          "price": 11.29,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — Postable (Under 1kg) — Standard",
          "price": 2.62,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — Postable (Under 1kg) — Next Day",
          "price": 3.2,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 0-1kg Small — Standard",
          "price": 2.62,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 0-1kg Small — Next Day",
          "price": 3.2,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 0-1kg Standard — Standard",
          "price": 2.62,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 0-1kg Standard — Next Day",
          "price": 3.2,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 1-2kg Small — Standard",
          "price": 2.62,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 1-2kg Small — Next Day",
          "price": 3.2,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 1kg-2kg Standard — Standard",
          "price": 2.62,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 1kg-2kg Standard — Next Day",
          "price": 3.2,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 2kg-5kg — Standard",
          "price": 2.62,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 2kg-5kg — Next Day",
          "price": 3.2,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 5kg-10kg — Standard",
          "price": 5.87,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 5kg-10kg — Next Day",
          "price": 6.82,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 10kg-15kg — Standard",
          "price": 9.01,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        },
        {
          "label": "To ParcelShop — 10kg-15kg — Next Day",
          "price": 10.61,
          "note": "VAT included. Size rules, postcode surcharges and service availability apply."
        }
      ],
      "checkedAt": "2026-10-04",
      "sourceUrls": [
        "https://www.evri.com/our-services/our-prices"
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
        "id": "ofgem-2026-07-01",
        "label": "Ofgem reference: 2026-07-01 to 2026-09-30",
        "validFrom": "2026-07-01",
        "validTo": "2026-09-30",
        "rate": 0.2611,
        "standing": 0.5719,
        "sourceUrl": "https://www.ofgem.gov.uk/your-energy-supply/your-energy-bill/energy-price-cap-unit-rates-and-standing-charges",
        "checkedAt": "2026-10-04"
      },
      {
        "id": "ofgem-2026-10-01",
        "label": "Ofgem reference: 2026-10-01 to 2026-12-31",
        "validFrom": "2026-10-01",
        "validTo": "2026-12-31",
        "rate": 0.2632,
        "standing": 0.5483,
        "sourceUrl": "https://www.ofgem.gov.uk/your-energy-supply/your-energy-bill/energy-price-cap-unit-rates-and-standing-charges",
        "checkedAt": "2026-10-04"
      }
    ],
    "note": "Great Britain average direct debit reference, including VAT. Supplier tariffs need a postcode, meter and payment method. Northern Ireland is outside the Ofgem price cap.",
    "supplierAudit": {
      "sourceUrl": "https://www.ofgem.gov.uk/sites/default/files/2026-06/List%20of%20all%20electricity%20licensees%20including%20suppliers.pdf",
      "checkedAt": "2026-10-04",
      "legalNamesNeedingReview": [
        "Jellyfish Energy Ltd"
      ],
      "note": "License register monitoring only. Brands can use different legal supply entities; no provider is automatically removed."
    }
  },
  "sourceStatus": {
    "ofgem": {
      "url": "https://www.ofgem.gov.uk/your-energy-supply/your-energy-bill/energy-price-cap-unit-rates-and-standing-charges",
      "lastAttempt": "2026-10-04",
      "status": "verified",
      "contentHash": "28b3a3303cd1e3fa8482b6f6e798d8d83f5885d994035ae35840534a0dd36ad2",
      "lastVerified": "2026-10-04"
    },
    "ofgem-suppliers": {
      "url": "https://www.ofgem.gov.uk/data/list-all-electricity-licensees-including-suppliers",
      "lastAttempt": "2026-10-04",
      "status": "verified",
      "contentHash": "2c083a94460ab4310356977c107276c7e3657c516169a788ce453e0600b97653",
      "lastVerified": "2026-10-04"
    },
    "inpost": {
      "url": "https://inpost.co.uk/send/parcel-prices",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "Cannot read robots.txt: HTTP 403"
    },
    "evri": {
      "url": "https://www.evri.com/our-services/our-prices",
      "lastAttempt": "2026-10-04",
      "status": "verified",
      "contentHash": "30d3de44a289d10ee3c8008a291e38605cc3420d31371da786d414cff1ab8d97",
      "lastVerified": "2026-10-04"
    },
    "royalmail-first": {
      "url": "https://www.royalmail.com/sending/uk/1st-class",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "Cannot read robots.txt: HTTP 403"
    },
    "royalmail-second": {
      "url": "https://www.royalmail.com/sending/uk/2nd-class",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "Cannot read robots.txt: HTTP 403"
    },
    "parcelforce": {
      "url": "https://www.parcelforce.com/sending-parcel/uk-parcel-delivery",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "Cannot read robots.txt: HTTP 403"
    },
    "dpd": {
      "url": "https://send.dpd.co.uk/",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "Source did not provide readable pricing guidance"
    },
    "dhl": {
      "url": "https://send.dhlparcel.co.uk/parcel-delivery",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "Source did not provide readable pricing guidance"
    },
    "ups": {
      "url": "https://www.ups.com/gb/en/support/shipping-support/shipping-costs-rates",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "Source did not provide readable pricing guidance"
    },
    "fedex": {
      "url": "https://www.fedex.com/en-gb/shipping/rates.html",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "Source did not provide readable pricing guidance"
    },
    "etsy-transaction": {
      "url": "https://help.etsy.com/hc/en-us/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "HTTP Error 403: Forbidden"
    },
    "etsy-regulatory": {
      "url": "https://help.etsy.com/hc/en-us/articles/1500011073202-What-is-a-Regulatory-Operating-Fee",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "HTTP Error 403: Forbidden"
    },
    "etsy-payments": {
      "url": "https://help.etsy.com/hc/en-us/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "HTTP Error 403: Forbidden"
    },
    "ebay": {
      "url": "https://www.ebay.co.uk/help/selling/fees-credits-invoices/store-selling-fees?id=4809",
      "lastAttempt": "2026-10-04",
      "status": "review-required",
      "contentHash": "8d277a0c0907a14b9e5d097dffef420f04d47c78230d5537eae68bf08c9827b7",
      "error": "could not convert string to float: '0.40.'"
    },
    "amazon": {
      "url": "https://sell.amazon.co.uk/programmes/handmade",
      "lastAttempt": "2026-10-04",
      "status": "verified",
      "contentHash": "d8f9d88d308a4e73bec3052dfa0ff54ca3d26ab3b9f6f7f5c6fa3e075086a8a4",
      "lastVerified": "2026-10-04"
    },
    "depop": {
      "url": "https://depophelp.zendesk.com/hc/en-gb/articles/360001791127-Seller-fees-and-charges",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "HTTP Error 403: Forbidden"
    },
    "vinted": {
      "url": "https://www.vinted.co.uk/pricelist",
      "lastAttempt": "2026-10-04",
      "status": "review-required",
      "contentHash": "02695db35c327c9f4b431e2e4d2e0840834f453963583054fda35adc116c6628",
      "error": "Zero seller fee guidance changed; keep the previous value for review"
    },
    "tiktok": {
      "url": "https://seller-uk.tiktok.com/university/essay?knowledge_id=10010004&lang=en-GB",
      "lastAttempt": "2026-10-04",
      "status": "review-required",
      "contentHash": "2756549ce89d3b24bb791085b0120685bde63be79e1cd7d53922c6216727883f",
      "error": "Expected one unambiguous rate; found 0"
    },
    "facebook": {
      "url": "https://www.facebook.com/help/1159837417996719",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "Source robots.txt disallows this URL"
    },
    "gumtree": {
      "url": "https://www.gumtree.com/info/safety/p/payments/how-fees-and-selling-costs-are-charged/",
      "lastAttempt": "2026-10-04",
      "status": "verified",
      "contentHash": "1984c40f4af772ca3598b749e333d005d33f689678bfbfc2d088bb89f8fe4546",
      "lastVerified": "2026-10-04"
    },
    "folksy": {
      "url": "https://folksy.com/selling",
      "lastAttempt": "2026-10-04",
      "status": "failed",
      "error": "Source did not provide readable pricing guidance"
    },
    "stripe": {
      "url": "https://stripe.com/gb/pricing",
      "lastAttempt": "2026-10-04",
      "status": "review-required",
      "contentHash": "6c36f055789d1c35339858ffa3321e684704cd7fcae5a4ff1a6cbf49369f5bbf",
      "error": "Official source could not be read: folksy"
    },
    "shopify": {
      "url": "https://www.shopify.com/uk/pricing",
      "lastAttempt": "2026-10-04",
      "status": "verified",
      "contentHash": "431f203a7f75bebaf28e4b355da2276252ba52f0367f288a4b6af55485dad7a2",
      "lastVerified": "2026-10-04"
    }
  },
  "lastAttempt": "2026-10-04T17:04:23+01:00"
};
