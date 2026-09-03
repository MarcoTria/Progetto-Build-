"""
Crop manifest for PROGETTO BUILD renovation composites.

Every source file in assets_raw/ is a designer-made composite: a title
banner plus a BEFORE photo and an AFTER photo (side-by-side or stacked,
one file as a 2x2 grid). Boundaries below were measured per-file from
row/column pixel-variance profiling (scripts/analyze_composites.py),
not eyeballed — see PROCESSING.md for the method.

layout:
  "lr"   -> banner on top (rows [0, top)); photo band is [top, bottom_full]
            split into BEFORE (cols [0, split_l)) / AFTER (cols [split_r, w])
  "tb"   -> BEFORE occupies rows [top, before_bottom); AFTER occupies
            rows [after_top, bottom)
  "grid" -> 2x2: header rows [0, top); before-row [top, mid_bottom) split
            into two quadrants by columns; after-row [mid_top, bottom)
            split the same way
"""

MANIFEST = {
    "main-entryway": {
        "title": "Main Entry & Façade",
        "pairs": [
            {
                "src": "358beb6f-ffac-41e8-acac-5fac3a1397c1.JPG",
                "layout": "lr",
                "top": 128, "bottom": 1024,
                "split_l": 763, "split_r": 770,
                "label": "Garage & Driveway",
            },
            {
                "src": "370ce198-2ea3-477a-b57c-3a3842f49ffb.JPG",
                "layout": "lr",
                "top": 116, "bottom": 1024,
                "split_l": 764, "split_r": 771,
                "label": "Side Entry Path",
            },
        ],
    },
    "master-bedroom": {
        "title": "Master Bedroom",
        "pairs": [
            {
                "src": "12b02951-a416-40a7-b6fa-8feeea817496.JPG",
                "layout": "lr",
                "top": 163, "bottom": 1086,
                "split_l": 717, "split_r": 727,
            },
        ],
    },
    "upstairs-bathroom": {
        "title": "Upstairs Bathroom",
        "pairs": [
            {
                "src": "1b165ca9-07bf-4463-aed9-c8e781a92fdd.JPG",
                "layout": "lr",
                "top": 134, "bottom": 1086,
                "split_l": 720, "split_r": 728,
            },
        ],
    },
    "first-floor-bedroom": {
        "title": "1st Floor Bedroom",
        "pairs": [
            {
                "src": "494f2522-5745-4f1a-9281-ebc5993b929e.JPG",
                "layout": "lr",
                "top": 129, "bottom": 1086,
                "split_l": 710, "split_r": 719,
            },
        ],
    },
    "backyard-pool": {
        "title": "Backyard & Pool",
        "pairs": [
            {
                "src": "531fbd7a-3a42-4948-8aa7-5966bac68681.JPG",
                "layout": "lr",
                "top": 149, "bottom": 1086,
                "split_l": 713, "split_r": 722,
            },
        ],
    },
    "upstairs-lounge": {
        "title": "Upstairs Lounge",
        "pairs": [
            {
                "src": "53bb64f7-cb8b-4b2f-abd9-bcfbaa00bfce.JPG",
                "layout": "tb",
                "top": 116, "before_bottom": 580,
                "after_top": 631, "bottom": 1122,
                "left": 284, "right": 1119,
            },
        ],
    },
    "upstairs-bedroom-1": {
        "title": "Upstairs Bedroom",
        "pairs": [
            {
                "src": "79e2cc3e-bc20-433a-9630-0b27cd220100.JPG",
                "layout": "tb",
                "top": 140, "before_bottom": 540,
                "after_top": 644, "bottom": 1086,
            },
        ],
    },
    "master-bathroom": {
        "title": "Master Bathroom",
        "pairs": [
            {
                "src": "adcc1884-8b60-47b2-9059-baacb9d0e944.JPG",
                "layout": "tb",
                "top": 119, "before_bottom": 574,
                "after_top": 620, "bottom": 1122,
            },
        ],
    },
    "kitchen": {
        "title": "Kitchen",
        "pairs": [
            {
                "src": "c5e37347-d36b-4aaf-98a0-ed58bd0dd603.jpg",
                "layout": "tb",
                "top": 116, "before_bottom": 583,
                "after_top": 621, "bottom": 1122,
                "left": 90, "right": 1296,
            },
        ],
    },
    "game-room": {
        "title": "Game Room",
        "pairs": [
            {
                "src": "f21a7959-97ce-4309-af42-4100ae0708a9.JPG",
                "layout": "lr",
                "top": 96, "bottom": 1024,
                "split_l": 760, "split_r": 770,
            },
        ],
    },
    "jack-and-jill-bathroom": {
        "title": "Jack & Jill Bathroom",
        "pairs": [
            {
                "src": "b646ba2d-52f3-49df-b139-2baafd8bfe97.JPG",
                "layout": "grid",
                "top": 124, "mid_bottom": 591,
                "mid_top": 628, "bottom": 1066,
                "split_l": 713, "split_r": 732,
                "label": "Vanity",
                "quadrant": "left",
            },
            {
                "src": "b646ba2d-52f3-49df-b139-2baafd8bfe97.JPG",
                "layout": "grid",
                "top": 124, "mid_bottom": 591,
                "mid_top": 628, "bottom": 1066,
                "split_l": 713, "split_r": 732,
                "label": "Shower & Access",
                "quadrant": "right",
            },
        ],
    },
}
