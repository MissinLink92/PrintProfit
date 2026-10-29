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
      "note": "UK Etsy Payments: 6.5% transaction plus 0.48% regulatory fee; processing 4% + £0.20. Applies to postage as well as item price. Listing fees, adverts, conversion and VAT on seller fees are additional where applicable. Manually checked 2026-10-19; review by 2026-10-26.",
      "checkedAt": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://help.etsy.com/hc/en-gb/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy",
        "https://help.etsy.com/hc/en-gb/articles/1500011073202-What-is-a-Regulatory-Operating-Fee",
        "https://help.etsy.com/hc/en-gb/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy"
      ]
    },
    "ebay": {
      "platform": 12.25,
      "pay": 0,
      "fixed": 0.4,
      "note": "eBay UK business Home/Furniture & DIY, up to £500; order fee shown for orders over £10. Other categories, tiers, VAT and listing fees may differ. Platform 12.25%; payments 0% + £0.40. Checked 2026-10-29.",
      "checkedAt": "2026-10-29",
      "sourceUrls": [
        "https://www.ebay.co.uk/help/selling/fees-credits-invoices/store-selling-fees?id=4809"
      ]
    },
    "amazon": {
      "platform": 12.24,
      "pay": 0,
      "fixed": 0,
      "note": "Amazon Handmade UK. Monthly plan costs are not allocated per sale. Platform 12.24%; payments 0% + £0.00. Checked 2026-10-29.",
      "checkedAt": "2026-10-29",
      "sourceUrls": [
        "https://sell.amazon.co.uk/programmes/handmade"
      ]
    },
    "depop": {
      "platform": 0,
      "pay": 2.9,
      "fixed": 0.3,
      "note": "UK sellers: no standard selling fee; payment processing 2.9% + £0.30 on item price, postage and applicable taxes. Optional Boosted Listing fees excluded. Manually checked 2026-10-19; review by 2026-10-26.",
      "checkedAt": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://depophelp.zendesk.com/hc/en-gb/articles/360001791127-Seller-fees-and-charges"
      ]
    },
    "vinted": {
      "platform": 0,
      "pay": 0,
      "fixed": 0,
      "note": "Standard Vinted UK selling has zero selling fees. Buyer charges and optional paid promotions excluded; check product eligibility and business seller rules. Manually checked 2026-10-19; review by 2026-10-26.",
      "checkedAt": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://www.vinted.co.uk/how_it_works"
      ]
    },
    "tiktok": {
      "platform": 9,
      "pay": 0,
      "fixed": 0,
      "note": "TikTok Shop UK standard commission 9%, including applicable taxes. Commission also applies to customer-paid shipping; category and incentive reductions and optional charges may differ. Manually checked 2026-10-19; review by 2026-10-26.",
      "checkedAt": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://seller-uk.tiktok.com/university/essay?knowledge_id=7753824408913665&lang=en-GB"
      ]
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
      "note": "Gumtree UK seller payment fees; paid business listings and promotions excluded. Platform 0%; payments 0% + £0.00. Checked 2026-10-29.",
      "checkedAt": "2026-10-29",
      "sourceUrls": [
        "https://www.gumtree.com/info/safety/p/payments/how-fees-and-selling-costs-are-charged/"
      ]
    },
    "folksy": {
      "platform": 7.2,
      "pay": 1.5,
      "fixed": 0.2,
      "note": "Folksy Basic including commission VAT; Stripe standard UK cards. Listing fees excluded. Platform 7.2%; payments 1.5% + £0.20. Checked 2026-10-29.",
      "checkedAt": "2026-10-29",
      "sourceUrls": [
        "https://folksy.uservoice.com/knowledgebase/articles/58077-how-much-does-it-cost-to-sell-on-folksy",
        "https://stripe.com/gb/pricing"
      ]
    },
    "shopify": {
      "platform": 0,
      "pay": 2.0,
      "fixed": 0.25,
      "note": "Shopify Payments Basic standard online UK cards. Monthly plan costs are not allocated per sale. Platform 0%; payments 2.0% + £0.25. Checked 2026-10-29.",
      "checkedAt": "2026-10-29",
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
      "source": "Royal Mail online UK reference — manually checked 2026-10-19",
      "rates": [
        {
          "label": "1st Class — Letter up to 100g",
          "price": 1.8,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "1st Class — Large letter up to 100g",
          "price": 3.2,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "1st Class — Large letter 101–250g",
          "price": 3.3,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "1st Class — Large letter 251–500g",
          "price": 3.3,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "1st Class — Large letter 501–750g",
          "price": 3.3,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "1st Class — Small parcel up to 2kg",
          "price": 5.7,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "1st Class — Medium parcel up to 2kg",
          "price": 8.2,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "1st Class — Medium parcel over 2–10kg",
          "price": 10.4,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "1st Class — Medium parcel over 10–20kg",
          "price": 16.4,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "2nd Class — Letter up to 100g",
          "price": 0.91,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "2nd Class — Large letter up to 100g",
          "price": 1.55,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "2nd Class — Large letter 101–250g",
          "price": 1.9,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "2nd Class — Large letter 251–500g",
          "price": 2.4,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "2nd Class — Large letter 501–750g",
          "price": 2.7,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "2nd Class — Small parcel up to 2kg",
          "price": 4.4,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "2nd Class — Medium parcel up to 2kg",
          "price": 7,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "2nd Class — Medium parcel over 2–10kg",
          "price": 9,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        },
        {
          "label": "2nd Class — Medium parcel over 10–20kg",
          "price": 13.7,
          "note": "Online price; VAT exempt. Maximum: letter 24×16.5×0.5cm; large letter 35.3×25×2.5cm; small parcel 45×35×16cm; medium parcel 61×46×46cm. Compensation conditions apply."
        }
      ],
      "checkedAt": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://www.royalmail.com/sending/uk/1st-class",
        "https://www.royalmail.com/sending/uk/2nd-class"
      ]
    },
    "evri": {
      "source": "Evri official UK reference — checked 2026-10-29",
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
      "quoteRequired": false,
      "checkedAt": "2026-10-29",
      "sourceUrls": [
        "https://www.evri.com/our-services/our-prices"
      ]
    },
    "inpost": {
      "source": "InPost official UK reference — manually checked 2026-10-19",
      "rates": [
        {
          "label": "Locker / Shop — Small",
          "price": 1.99,
          "note": "Up to 15kg. Maximum 8 × 38 × 64cm. Packaging and service eligibility apply."
        },
        {
          "label": "Locker / Shop — Medium",
          "price": 2.59,
          "note": "Up to 15kg. Maximum 19 × 38 × 64cm. Packaging and service eligibility apply."
        },
        {
          "label": "Locker / Shop — Large",
          "price": 3.99,
          "note": "Up to 15kg. Maximum 41 × 38 × 64cm. Packaging and service eligibility apply."
        },
        {
          "label": "Home address — Small",
          "price": 2.89,
          "note": "Up to 15kg. Maximum 8 × 38 × 64cm. Packaging and service eligibility apply."
        },
        {
          "label": "Home address — Medium",
          "price": 3.99,
          "note": "Up to 15kg. Maximum 19 × 38 × 64cm. Packaging and service eligibility apply."
        },
        {
          "label": "Home address — Large",
          "price": 5.99,
          "note": "Up to 15kg. Maximum 41 × 38 × 64cm. Packaging and service eligibility apply."
        }
      ],
      "checkedAt": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://inpost.co.uk/send/parcel-prices"
      ]
    },
    "dpd": {
      "source": "DPD advertised starting price — quote required",
      "rates": [
        {
          "label": "UK advertised starting price — quote required",
          "price": 2.99,
          "note": "Starting price only. Enter the carrier quote for the actual weight, dimensions, destination, VAT, surcharges and account terms."
        }
      ],
      "quoteRequired": true,
      "checkedAt": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://send.dpd.co.uk/"
      ]
    },
    "dhl": {
      "source": "DHL advertised starting price — quote required",
      "rates": [
        {
          "label": "UK advertised starting price — quote required",
          "price": 3.78,
          "note": "Starting price only. Enter the carrier quote for the actual weight, dimensions, destination, VAT, surcharges and account terms."
        }
      ],
      "quoteRequired": true,
      "checkedAt": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://send.dhlparcel.co.uk/parcel-delivery"
      ]
    },
    "parcelforce": {
      "source": "Parcelforce UK retail prices from 7 April 2026 — existing reference; not yet checked by the nightly updater — unverified estimate; obtain a parcel quote",
      "rates": [
        {
          "label": "express48 — from £11.95",
          "price": 11.95,
          "note": "Unverified estimate. Obtain a quote for the actual parcel before setting your selling price. Up to 30kg; tracked."
        },
        {
          "label": "express24 — from £12.50",
          "price": 12.5,
          "note": "Unverified estimate. Obtain a quote for the actual parcel before setting your selling price. Up to 30kg; tracked."
        },
        {
          "label": "expressAM — from £16.50",
          "price": 16.5,
          "note": "Unverified estimate. Obtain a quote for the actual parcel before setting your selling price. Up to 30kg; next working day by noon."
        },
        {
          "label": "express10 — from £28.10",
          "price": 28.1,
          "note": "Unverified estimate. Obtain a quote for the actual parcel before setting your selling price. Up to 30kg; next working day by 10am."
        },
        {
          "label": "express48large — from £51.65",
          "price": 51.65,
          "note": "Unverified estimate. Obtain a quote for the actual parcel before setting your selling price. Large parcel service."
        }
      ],
      "quoteRequired": true
    },
    "ups": {
      "source": "UPS UK public rate guidance — existing reference; not yet checked by the nightly updater — unverified estimate; obtain a parcel quote",
      "rates": [
        {
          "label": "Domestic UK — quote required",
          "price": 0,
          "note": "Unverified estimate. Obtain a quote for the actual parcel before setting your selling price. Enter your quoted UPS rate in Cost to you."
        }
      ],
      "quoteRequired": true
    },
    "fedex": {
      "source": "FedEx UK rates effective 5 January 2026 — existing reference; not yet checked by the nightly updater — unverified estimate; obtain a parcel quote",
      "rates": [
        {
          "label": "Domestic UK — quote required",
          "price": 0,
          "note": "Unverified estimate. Obtain a quote for the actual parcel before setting your selling price. Enter your quoted FedEx rate in Cost to you."
        }
      ],
      "quoteRequired": true
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
        "checkedAt": "2026-10-29"
      },
      {
        "id": "ofgem-2026-10-01",
        "label": "Ofgem reference: 2026-10-01 to 2026-12-31",
        "validFrom": "2026-10-01",
        "validTo": "2026-12-31",
        "rate": 0.2632,
        "standing": 0.5483,
        "sourceUrl": "https://www.ofgem.gov.uk/your-energy-supply/your-energy-bill/energy-price-cap-unit-rates-and-standing-charges",
        "checkedAt": "2026-10-29"
      }
    ],
    "note": "Great Britain average direct debit reference, including VAT. Supplier tariffs need a postcode, meter and payment method. Northern Ireland is outside the Ofgem price cap.",
    "supplierAudit": {
      "sourceUrl": "https://www.ofgem.gov.uk/sites/default/files/2026-06/List%20of%20all%20electricity%20licensees%20including%20suppliers.pdf",
      "checkedAt": "2026-10-29",
      "legalNamesNeedingReview": [
        "Jellyfish Energy Ltd"
      ],
      "note": "License register monitoring only. Brands can use different legal supply entities; no provider is automatically removed."
    }
  },
  "sourceStatus": {
    "ofgem": {
      "url": "https://www.ofgem.gov.uk/your-energy-supply/your-energy-bill/energy-price-cap-unit-rates-and-standing-charges",
      "lastAttempt": "2026-10-29",
      "status": "verified",
      "contentHash": "e74b053135e5b1b65bdac6cfbaf08bea207ee70d7a51e8287c7875d59b494050",
      "lastVerified": "2026-10-29"
    },
    "ofgem-suppliers": {
      "url": "https://www.ofgem.gov.uk/data/list-all-electricity-licensees-including-suppliers",
      "lastAttempt": "2026-10-29",
      "status": "verified",
      "contentHash": "0856ffef624e91d2946e16555ac51550fc8306c68d2978883e79d5a6e20c250b",
      "lastVerified": "2026-10-29"
    },
    "inpost": {
      "url": "https://inpost.co.uk/send/parcel-prices",
      "lastAttempt": "2026-10-29",
      "status": "failed",
      "error": "Cannot read robots.txt: HTTP 403",
      "automaticStatus": "failed",
      "lastVerified": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://inpost.co.uk/send/parcel-prices"
      ]
    },
    "evri": {
      "url": "https://www.evri.com/our-services/our-prices",
      "lastAttempt": "2026-10-29",
      "status": "verified",
      "contentHash": "14ce2260b0573581336a8ccb6b0d1a553e40d317ad4ba279f4738fccfd472f99",
      "lastVerified": "2026-10-29"
    },
    "royalmail-first": {
      "url": "https://www.royalmail.com/sending/uk/1st-class",
      "lastAttempt": "2026-10-29",
      "status": "failed",
      "error": "Cannot read robots.txt: HTTP 403",
      "automaticStatus": "failed",
      "lastVerified": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://www.royalmail.com/sending/uk/1st-class",
        "https://www.royalmail.com/sending/uk/2nd-class"
      ]
    },
    "royalmail-second": {
      "url": "https://www.royalmail.com/sending/uk/2nd-class",
      "lastAttempt": "2026-10-29",
      "status": "failed",
      "error": "Cannot read robots.txt: HTTP 403",
      "automaticStatus": "failed",
      "lastVerified": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://www.royalmail.com/sending/uk/1st-class",
        "https://www.royalmail.com/sending/uk/2nd-class"
      ]
    },
    "parcelforce": {
      "url": "https://www.parcelforce.com/sending-parcel/uk-parcel-delivery",
      "lastAttempt": "2026-10-29",
      "status": "failed",
      "error": "Cannot read robots.txt: HTTP 403"
    },
    "dpd": {
      "url": "https://send.dpd.co.uk/",
      "lastAttempt": "2026-10-29",
      "status": "failed",
      "error": "Source did not provide readable pricing guidance",
      "automaticStatus": "failed",
      "lastVerified": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://send.dpd.co.uk/"
      ]
    },
    "dhl": {
      "url": "https://send.dhlparcel.co.uk/parcel-delivery",
      "lastAttempt": "2026-10-29",
      "status": "failed",
      "error": "Source did not provide readable pricing guidance",
      "automaticStatus": "failed",
      "lastVerified": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://send.dhlparcel.co.uk/parcel-delivery"
      ]
    },
    "ups": {
      "url": "https://www.ups.com/gb/en/support/shipping-support/shipping-costs-rates",
      "lastAttempt": "2026-10-29",
      "status": "failed",
      "error": "Source did not provide readable pricing guidance"
    },
    "fedex": {
      "url": "https://www.fedex.com/en-gb/shipping/rates.html",
      "lastAttempt": "2026-10-29",
      "status": "failed",
      "error": "Source did not provide readable pricing guidance"
    },
    "etsy-transaction": {
      "url": "https://help.etsy.com/hc/en-us/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy",
      "lastAttempt": "2026-10-29",
      "status": "review-required",
      "error": "Expected one unambiguous rate; found 0",
      "automaticStatus": "failed",
      "lastVerified": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://help.etsy.com/hc/en-gb/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy",
        "https://help.etsy.com/hc/en-gb/articles/1500011073202-What-is-a-Regulatory-Operating-Fee",
        "https://help.etsy.com/hc/en-gb/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy"
      ],
      "contentHash": "e6954dfa61434285498335d662fa5af218763737e2b1fe3e84c53a95247bcd6a"
    },
    "etsy-regulatory": {
      "url": "https://help.etsy.com/hc/en-us/articles/1500011073202-What-is-a-Regulatory-Operating-Fee",
      "lastAttempt": "2026-10-29",
      "status": "review-required",
      "error": "Expected one unambiguous rate; found 0",
      "automaticStatus": "failed",
      "lastVerified": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://help.etsy.com/hc/en-gb/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy",
        "https://help.etsy.com/hc/en-gb/articles/1500011073202-What-is-a-Regulatory-Operating-Fee",
        "https://help.etsy.com/hc/en-gb/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy"
      ],
      "contentHash": "cc84d1067c8acd9f396d4f10f29281c26ec159196d8cfa4a118d9022757e84ad"
    },
    "etsy-payments": {
      "url": "https://help.etsy.com/hc/en-us/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy",
      "lastAttempt": "2026-10-29",
      "status": "review-required",
      "error": "Expected one unambiguous rate; found 0",
      "automaticStatus": "failed",
      "lastVerified": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://help.etsy.com/hc/en-gb/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy",
        "https://help.etsy.com/hc/en-gb/articles/1500011073202-What-is-a-Regulatory-Operating-Fee",
        "https://help.etsy.com/hc/en-gb/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy"
      ],
      "contentHash": "d2653b40efd0f9ed1b5cde6ff526a12ab905e350614063d3c0e0301a64773076"
    },
    "ebay": {
      "url": "https://www.ebay.co.uk/help/selling/fees-credits-invoices/store-selling-fees?id=4809",
      "lastAttempt": "2026-10-29",
      "status": "verified",
      "contentHash": "672da9c0599dcbe258f881adb37af0ca38adf3ef23f835fac245f55199e2e09e",
      "lastVerified": "2026-10-29"
    },
    "amazon": {
      "url": "https://sell.amazon.co.uk/programmes/handmade",
      "lastAttempt": "2026-10-29",
      "status": "verified",
      "contentHash": "f2d072149e8f0f48069009f905feac54d57205ca5eab8a9a5a20ca107c1db4c9",
      "lastVerified": "2026-10-29"
    },
    "depop": {
      "url": "https://depophelp.zendesk.com/hc/en-gb/articles/360001791127-Seller-fees-and-charges",
      "lastAttempt": "2026-10-29",
      "status": "failed",
      "error": "HTTP Error 403: Forbidden",
      "automaticStatus": "failed",
      "lastVerified": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://depophelp.zendesk.com/hc/en-gb/articles/360001791127-Seller-fees-and-charges"
      ]
    },
    "vinted": {
      "url": "https://www.vinted.co.uk/pricelist",
      "lastAttempt": "2026-10-29",
      "status": "review-required",
      "contentHash": "c633f181f1ed31f190025910f2593800b096e9b0c035f7b7b26bea94a8694987",
      "error": "Zero seller fee guidance changed; keep the previous value for review",
      "automaticStatus": "review-required",
      "lastVerified": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://www.vinted.co.uk/how_it_works"
      ]
    },
    "tiktok": {
      "url": "https://seller-uk.tiktok.com/university/essay?knowledge_id=10010004&lang=en-GB",
      "lastAttempt": "2026-10-29",
      "status": "review-required",
      "contentHash": "a75a33f8776b91b50b6b4227db4a76d3c0840998b36da63fe610430889611d12",
      "error": "Expected one unambiguous rate; found 0",
      "automaticStatus": "review-required",
      "lastVerified": "2026-10-19",
      "reviewAfter": "2026-10-26",
      "verificationMethod": "manual",
      "sourceUrls": [
        "https://seller-uk.tiktok.com/university/essay?knowledge_id=7753824408913665&lang=en-GB"
      ]
    },
    "facebook": {
      "url": "https://www.facebook.com/help/1159837417996719",
      "lastAttempt": "2026-10-29",
      "status": "failed",
      "error": "Source robots.txt disallows this URL"
    },
    "gumtree": {
      "url": "https://www.gumtree.com/info/safety/p/payments/how-fees-and-selling-costs-are-charged/",
      "lastAttempt": "2026-10-29",
      "status": "verified",
      "contentHash": "1984c40f4af772ca3598b749e333d005d33f689678bfbfc2d088bb89f8fe4546",
      "lastVerified": "2026-10-29"
    },
    "folksy": {
      "url": "https://folksy.uservoice.com/knowledgebase/articles/58077-how-much-does-it-cost-to-sell-on-folksy",
      "lastAttempt": "2026-10-29",
      "status": "verified",
      "contentHash": "9b2455d30cb2ae0c0991a949a4f5876fba542136c962cdc363092f1da957956a",
      "lastVerified": "2026-10-29"
    },
    "stripe": {
      "url": "https://stripe.com/gb/pricing",
      "lastAttempt": "2026-10-29",
      "status": "verified",
      "contentHash": "8141294581e80716d9f4a82bcb1c230af8986717dcc0ca14612a49cacc6a60dd",
      "lastVerified": "2026-10-29"
    },
    "shopify": {
      "url": "https://www.shopify.com/uk/pricing",
      "lastAttempt": "2026-10-29",
      "status": "verified",
      "contentHash": "fee36b999b5816047fe7885a1e768ae4c4f408ce0a3404f529db2190d5a34de8",
      "lastVerified": "2026-10-29"
    }
  },
  "lastAttempt": "2026-10-29T03:56:19+00:00",
  "exchangeRates": {
    "base": "GBP",
    "date": "2026-10-28",
    "sourceUrl": "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",
    "rates": {
      "GBP": 1.0,
      "EUR": 1.19353106,
      "USD": 1.32875813,
      "PLN": 5.25690756,
      "CAD": 1.86644387,
      "AUD": 1.88935967,
      "CHF": 1.10365817,
      "SEK": 13.19567942,
      "NOK": 12.35006266,
      "DKK": 8.92057051,
      "CZK": 29.08277138,
      "JPY": 209.8943725,
      "CNY": 8.85802948,
      "INR": 126.52563108,
      "NZD": 2.36713015,
      "SGD": 1.70364624,
      "BRL": 7.07847467,
      "MXN": 24.75574387,
      "ZAR": 22.12078534
    },
    "note": "ECB reference rates, not a bank or payment-provider quote.",
    "lastAttempt": "2026-10-29T03:56:19+00:00",
    "status": "verified"
  }
};
