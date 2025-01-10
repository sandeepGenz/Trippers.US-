# API Docs and Reference | Trippers.us

#### An easy to use suite of APIs that offer recommendations for inclusive and relevant travel experiences, by _Trippers.us_ | for IBC Hack at Sabre India<br><br>

## **How it works**

Drive revenue for your company and offer personalized, inclusive travel and tourism options for your users- here's how

- _Integrate our APIs_: Simply feed the PNR generated upon booking, and receive a relevant set of tourist attractions and ancillaries.<br>

- _Upsell better_: Users are more likely to purchase relevant suggestions.<br>

- _No user intervention; optional customization_: All this, without explicitly asking the user for preferences, purely powered by PNR. However, you can also allow the user to handpick special service requests<br>

<br><br>

## **Endpoints**

### **Sign up**

POST `/api/v1/auth/signup`<br>

Request body

```
{
    "name": "XYTravels",
    "email": "xyz.official@xy.com",
    "password": "1234xyz"
}
```

Response

```
{
    "result": "Created successfully"
}
```

### **Login**

POST `/api/v1/auth/login`<br>

Request body

```
{
    "email": "xyz.official@xy.com",
    "password": "1234xyz"
}
```

Response

```
{
    "result": "<YOUR-AUTH-KEY>"
}
```

### **Get recommended attractions**

POST `/api/v1/getRecommendedAttractions`

Request body
```
{
    "PNR": {
        "destination": "Bangalore",
        "passengerCategory": {
            "SRC": true
        }
    },
    "additionalSSR": {
        "lowSpiceFood": true,
        "MAAS": true
    }
}
```

Response
```
{
    "attractions": [
        {
            "name": "Vishnu Temple",
            "attractionType": "WORHSIP",
            "restaurantsNearby": 56,
            "attractionsNearby": 45
        }
    ]
}
```

### **Get recommended ancillaries**

POST `/api/v1/getRecommendedAncillaries`

Request body
```
{
    "PNR": {
        "destination": "Bangalore",
        "passengerCategory": {
            "SRC": true
        }
    },
    "additionalSSR": {
        "lowSpiceFood": true,
        "MAAS": true
    }
}
```

```
Response
{
    "ancillaries": [
        {
            "price": "1800",
            "serviceCategory": [
                "WCHR",
                "SRC"
            ],
            "name": "Passport and visa services"
        },
        {
            "price": "200",
            "name": "Low spice food",
            "serviceCategory": [
                "SRC",
                "CHD"
            ]
        },
        {
            "serviceCategory": [
                "SRC",
                "WCHR",
                "CHD"
            ],
            "price": "900",
            "name": "Luggage transfer"
        },
        {
            "price": "1500",
            "serviceCategory": [
                "SRC",
                "WCHR"
            ],
            "name": "Tour guiding"
        },
        {
            "serviceCategory": [
                "WCHR",
                "CHD",
                "SRC"
            ],
            "name": "Restaurants and restrooms",
            "price": "400"
        },
        {
            "price": "100",
            "name": "Travel insurance",
            "serviceCategory": [
                "CHD",
                "WCHR",
                "SRC"
            ]
        },
        {
            "name": "Lounge access",
            "serviceCategory": [
                "WCHR",
                "SRC"
            ],
            "price": "1400"
        },
        {
            "name": "Amenity kit",
            "price": "600",
            "serviceCategory": [
                "SRC",
                "WCHR"
            ]
        },
        {
            "price": "1000",
            "serviceCategory": [
                "CHD",
                "SRC",
                "WCHR"
            ],
            "name": "Cab service"
        },
        {
            "name": "Meet and assist",
            "price": "2000",
            "serviceCategory": [
                "WCHR",
                "SRC"
            ]
        }
    ]
}
```

### **Fetch supported SSR flags**

GET `/api/v1/fetchSupportedSSRFlags`

Response
```
{
    "SSRFlags": [
        "lowSpiceFood",
        "headphones",
        "MAAS",
        "veganFood",
        "vegFood",
        "wheelchair"
    ]
}
```