window.SEED_CATEGORIES = [
  "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
  "Cleaning & Sanitation: Surfaces, Equipment",
  "Time & Temperature: Machines Boards, Reach-in Fridges/Freezers",
  "Time & Temperature: Freezer, Thaw Cabinet, Holding Cabinet, Breading Table",
  "Time & Temperature: Walk-in Cooler, Prep, Front of House",
  "Cross-contamination Part 1",
  "Cross-contamination Part 2",
  "Health & Hygiene: Team Members",
  "Health & Hygiene: Handwashing, Gloves"
];

window.SEED_QUESTIONS = [
  {
    "id": "SDC.351.a",
    "text": "Is the compartment sink stocked with detergent (Kay® SolidSense™ All Purpose Super Concentrate)?",
    "guidance": "Look for the chemical block in the dispenser.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.351.b",
    "text": "Is the compartment sink stocked with sanitizer (SolidSense or KAYQUAT)",
    "guidance": "Look for the chemical in the dispenser.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.335.a",
    "text": "Are quat sanitizer test strips easily accessible, not expired or damaged?",
    "guidance": "Check test strips that are used for quat sanitizer at the compartment sink. Answer YES if all criteria is met.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - expired",
      "No - damaged",
      "No - out of stock",
      "Not observable"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.313.b",
    "text": "Is the quat sanitizer at the compartment sink at proper concentration (150 - 400 PPM)?",
    "guidance": "Use quat test strips to test sanitizer in newly filled sanitizing sink (at the compartment sink) to confirm chemical concentration is between 150 - 400 ppm (parts per million). If the dispenser is broken, select \"Not observable.\"",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - below 150 PPM",
      "No - above 400 PPM",
      "Not observable"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "IMMEDIATE"
  },
  {
    "id": "SDC.351.f",
    "text": "Is detergent available at the dish machine?",
    "guidance": "Not relevant to my restaurant Check below dishwasher for bottle. Select \"no\" if bottle is not present or empty.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.351.g",
    "text": "LOW TEMPERATURE DISH MACHINE: Is sanitizer available at the dish machine?",
    "guidance": "Not relevant to my restaurant",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.335.b",
    "text": "Are chlorine sanitizer test strips readily available and not expired?",
    "guidance": "Locate the test strips used to test Kay-5 Sanitizer and Low Temp Dishwasher concentration. Check YES if all criteria is met.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - expired",
      "No - damaged",
      "No - out of stock",
      "Not observable"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.333.b",
    "text": "Is Kay-5 Sanitizer available at the restaurant?",
    "guidance": "This chemical is required for cleaning the ice cream machine and beverage nozzles.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No",
      "Not observable"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.313.d",
    "text": "Is the Kay-5 in a spray bottle at proper concentration (50 -100 PPM)?",
    "guidance": "Dip chlorine test streps into freshly prepared Kay-5 sanitizing solution to ensure proper concentration prior to adding to hopper. If Kay-5 is not prepared, select \"Not observable.\" NOTE: Directions on Kay-5 (chlorine) test strip bottle identify a different range (50-200 ppm), but the standard set by Chick-fil-A, Inc. is 50-100 ppm.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - below 50 PPM",
      "No - above 100 PPM",
      "Not observable"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "IMMEDIATE"
  },
  {
    "id": "SDC.335.c",
    "text": "Are produce wash test strips readily available and not expired?",
    "guidance": "Locate the sanitizer test strips used to make produce wash (Antimicrobial Fruit and Vegetable Treatment). Check YES if all criteria is met.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - expired",
      "No - damaged",
      "No - out of stock",
      "Not observable"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.314",
    "text": "Is produce wash maintained at the proper concentration?",
    "guidance": "",
    "pathwayLink": false,
    "options": [],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "IMMEDIATE",
    "children": [
      {
        "id": "SDC.314.c",
        "text": "Is the produce wash dispenser set-up and used?",
        "guidance": "If produce wash system is not functioning properly, notify Restaurant leadership. If necessary, rinse produce under cold running water according to procedure until system is working correctly.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No - Dispenser malfunctioning and alternate procedure in place",
          "No - not connected",
          "No - not being used",
          "Not observable"
        ]
      },
      {
        "id": "SDC.314.b",
        "text": "Is produce wash maintained at the proper concentration?",
        "guidance": "Dip produce wash test strip into sanitizer, wait 3 seconds and compare to the bottle instructions. If no sanitizer is available, dispense fresh sanitizer and test.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No - concentration below .75 oz/gal",
          "No - concentration above 1.0 oz/gal",
          "Not observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.313.e",
    "text": "Is the quat sanitizer in spray bottles at proper concentration (150 - 400 PPM)?",
    "guidance": "Test sanitizer by dipping a quat test strip into sanitizer in container and confirming chemical concentration is between 150-400 ppm. If spray bottles are not yet prepared, select \"not observable.\"",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - below 150 PPM",
      "No - above 400 PPM",
      "Not observable"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "IMMEDIATE"
  },
  {
    "id": "SDC.313.c",
    "text": "Is the quat sanitizer in KICS buckets at proper concentration (150 - 400 PPM)?",
    "guidance": "Test sanitizer by dipping quat test strip into sanitizer in container and confirming chemical concentration is between 150-400 ppm. If KICS buckets are not yet prepared, select \"not observable.\"",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - below 150 PPM",
      "No - above 400 PPM",
      "Not observable"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "IMMEDIATE"
  },
  {
    "id": "SDC.313.a",
    "text": "Are all open buckets of quat sanitizer at proper concentration (150 - 400 PPM)?",
    "guidance": "Use quat test strips to test sanitizer in open buckets of sanitizer. If no buckets are prepared, select \"Not observable.\"",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - below 150 PPM",
      "No - above 400 PPM",
      "Not observable"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "IMMEDIATE"
  },
  {
    "id": "SDC.347",
    "text": "Are wiping cloths immersed in sanitizer and are separate cloths used for food-contact and non-food contact surfaces?",
    "guidance": "Select all that apply.",
    "pathwayLink": false,
    "options": [],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.345",
    "text": "Are all cleaning tools properly stored between uses and are cleaning tools durable/appropriate for the task?",
    "guidance": "",
    "pathwayLink": false,
    "options": [],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.345.a",
        "text": "Are all cleaning tools durable?",
        "guidance": "Look for chipping, melting, cracks, etc. Select all that apply.",
        "pathwayLink": false,
        "options": []
      },
      {
        "id": "SDC.345.b",
        "text": "Are Team Members using the right cleaning tool for the task?",
        "guidance": "Look for the wrong tool being used for the task. (e.g. white-handled fryer brush instead of red, using metal/green scrub pads on dishes instead of yellow or blue, using the ice cream machine hopper brush to scrub raw dishes, etc.) Select all that apply.",
        "pathwayLink": false,
        "options": []
      },
      {
        "id": "SDC.345.c",
        "text": "Are all cleaning tools stored properly between uses to avoid cross-contamination?",
        "guidance": "Select NO if these tools are stored in direct contact with food, equipment, utensils, and single-use items (packaging, utensils, etc).",
        "pathwayLink": false,
        "options": []
      }
    ]
  },
  {
    "id": "SDC.333.a",
    "text": "Are chemical containers and first aid supplies properly labeled with the common name of the product?",
    "guidance": "Original containers must have a legible manufacturer's label. Working containers such as spray bottles must be labeled with common names such as \"Sanitizer\" or \"Window Cleaner.\" Hand soap dispensers do NOT need labels. Select all that apply.",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No - chemical container label illegible or not labeled",
      "No - first aid supplies not labeled",
      "No - Team Member medications not labeled",
      "No - other:"
    ],
    "category": "Cleaning & Sanitation: Sanitizers, Cleaning Tools",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.351.c",
    "text": "Is the compartment sink clean and in good condition?",
    "guidance": "Select NO if compartment sink and/or its parts appear broken, cracked, bent, loose, etc. Select NO if it is not cleaned and sanitized between raw and ready-to-eat dishes.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.327.a",
    "text": "Does the compartment sink spray hose fall below the rim of the compartment sink?",
    "guidance": "",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.327.b",
    "text": "Is there an air gap between the compartment sink waste pipe (under the sink) and the floor drain?",
    "guidance": "Look under the sink and locate where the water drains into the floor. Ensure that there is a gap between the pipe and the drain.",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.351.d",
    "text": "Are raw dishes washed at a different time than ready-to-eat dishes in the compartment sink?",
    "guidance": "Select \"yes\" if raw dishes are not being washed with other dishes. Select \"not observable\" if dishes are not currently being washed.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No",
      "Not observable"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.351.e",
    "text": "Is the compartment sink being used for dishwashing and food prep at the same time?",
    "guidance": "Select \"yes\" if chicken or mac n cheese are being thawed in the sink while dishes are being washed. Quick thawing should not occur when dishes are being washed or stored in the compartment sink. Sanitize the sink after washing dishes and before quick thawing.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No",
      "Not observable"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.351.h",
    "text": "Are the exterior and interior of the dish machine clean?",
    "guidance": "Not relevant to my restaurant Make note of any debris, especially encrusted buildup that likely accumulated over time.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.351.j",
    "text": "HIGH TEMPERATURE DISH MACHINE: Is the water pressure between 13 and 27 PSI?",
    "guidance": "Not relevant to my restaurant Run a cycle and view gauge during final rinse cycle. Select NO if the gage is not working and make a note.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.317",
    "text": "HIGH TEMPERATURE DISH MACHINE: Does dish machine reach 160°F/721°C or above on the dish surface?",
    "guidance": "Not relevant to my restaurant (1) Turn ThermoWorks puck thermometer on according to instructions on back. Then place thermometer, or puck, on dish rack. For best results, place thermometer puck at an angle in a peg dish rack and wash by itself. The thermometer must be placed directly on dish rack, without any dishes on top of or underneath it. (2) Slide pegged rack with thermometer into dishwahser, close lid, and start a standard dish cycle. (3) When cycle is complete, open lid and check temperature reading on thermometer. Temperature should be 160°F or higher.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "IMMEDIATE"
  },
  {
    "id": "SDC.321",
    "text": "LOW TEMPERATURE DISH MACHINE: Is the sanitizer within proper concentration?",
    "guidance": "Not relevant to my restaurant Use chlorine test strips to evaluate. 1. Open dishwasher door and remove racks. 2. Dip test strip into tank water solution. 3. Blot test strip immediately onto paper towel. 4. Compare color of strip to color of sanitizer concentration chart. 5. Sanitizer solution should be between 50-100ppm.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - concentration below 50 PPM",
      "No - concentration above 100 PPM"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "IMMEDIATE"
  },
  {
    "id": "SDC.301",
    "text": "Are equipment, surfaces and utensils that touch food durable, non-toxic, and made of safe materials?",
    "guidance": "Look for tools and equipment that may have been brought from home, modified or purchased from a non-CFA retailer. Sometimes, these surfaces may not be safe for food. If you're unsure, leave a comment and follow up with leadership. Make note of equipment being used in the wrong way (e.g. pickle bucket being used as an ice bucket)",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.329",
    "text": "Are food contact surfaces smooth, easily cleanable, in good condition, and used properly?",
    "guidance": "",
    "pathwayLink": false,
    "options": [],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "MEDIUM",
    "children": [
      {
        "id": "SDC.329.a",
        "text": "Are FILET ROLLERS smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Look for chips or other damage.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.b",
        "text": "Are BISCUIT HEX ROLLERS smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Look for chipped or fraying edges.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.c",
        "text": "Are CUTTING BOARDS smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Look for excessive grooves.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.d",
        "text": "Are ICE BUCKETS smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Look for chipped/fraying edges or other damage.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.e",
        "text": "Are ICE PADDLES smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Look for chipped/fraying edges or other damage.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.f",
        "text": "Are ICE SCOOPS smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Look for chipped/fraying edges or other damage.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.g",
        "text": "Are FRY SKIMMERS smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Look for holes or welds that are not smooth to the touch.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.h",
        "text": "Are FRYER BASKETS smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Look for holes, dents or welds that are not smooth to the touch.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.i",
        "text": "Is ANTUNES EGG STATION GRILL smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Look for damage or rough surfaces that are not easy to clean.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.j",
        "text": "Are BREADING SIFTERS/NUGGET BASKETS smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Look for damage.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.m",
        "text": "Are FRY SCOOPS smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Look for chips, cracks or other damage.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.k",
        "text": "Is LETTUCE CHOPPER smooth, easily cleanable, in good condition, and used properly?",
        "guidance": "Make note of any other food contact surfaces that you notice.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.329.l",
        "text": "Other - Did you find another food contact surface that's not smooth, easily cleanable or in good condition?",
        "guidance": "Make note of any other food contact surfaces that you notice.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.303",
    "text": "Are food-contact surfaces in storage properly cleaned and sanitized or at least every four hours during continuous use at room temperature?",
    "guidance": "Look for food debris and encrusted buildup on dishes stored as clean. If the surface is at room temperature and being continuously used, determine if it has been sanitized every 4 hours by asking a Team Member, reviewing your checklist, etc.",
    "pathwayLink": false,
    "options": [],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "IMMEDIATE",
    "children": [
      {
        "id": "SDC.303.a",
        "text": "Are CHICKEN SLICERS in storage properly cleaned and sanitized or at least every four hours during continuous use at room temperature?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.303.b",
        "text": "Are CUTTING BOARDS in storage properly cleaned and sanitized or at least every four hours during continuous use at room temperature?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.303.c",
        "text": "Are EGG SLICERS in storage properly cleaned and sanitized or at least every four hours during continuous use at room temperature?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.303.d",
        "text": "Are PANS/KANBANS in storage properly cleaned and sanitized or at least every four hours during continuous use at room temperature?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.303.e",
        "text": "Are FILET ROLLERS in storage properly cleaned and sanitized or at least every four hours during continuous use at room temperature?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.303.f",
        "text": "Are KNIVES in storage properly cleaned and sanitized or at least every four hours during continuous use at room temperature?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.303.g",
        "text": "Are LETTUCE CHOPPERS in storage properly cleaned and sanitized or at least every four hours during continuous use at room temperature?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.303.h",
        "text": "Are LETTUCE SPINNERS in storage properly cleaned and sanitized or at least every four hours during continuous use at room temperature?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.303.i",
        "text": "Are LEMON WEDGERS in storage properly cleaned and sanitized or at least every four hours during continuous use at room temperature?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.303.j",
        "text": "Are TOMATO SLICERS in storage properly cleaned and sanitized or at least every four hours during continuous use at room temperature?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.303.k",
        "text": "Are thermometer probes sanitized before use?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.303.l",
        "text": "Did you find anything else?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.337",
    "text": "Are clean utensils, equipment, and food contact packaging stored in a sanitary manner?",
    "guidance": "Select all that apply. Items stored in stacks should be inverted to prevent dust and debris from collecting inside. Select OTHER for situations like: trash bags stored on the ground leaning on/touching clean utensils/pans on a shelf in BOH, food packaging and catering trays at Boards, Salad Prep and Dry Storage are not stored inverted.",
    "pathwayLink": false,
    "options": [],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "LOW"
  },
  {
    "id": "SDC.311",
    "text": "Are the food-contact surfaces of the ice machine, ice bins, and beverage nozzles properly cleaned and sanitized?",
    "guidance": "Use a flashlight to assess ice machine interior. If you notice any discoloration, wipe the interior with a paper towel/coffee filter to determine if it is removable buildup. Remove 3 soda nozzles/diffusers to assess. Use flashlight to assess nozzle, diffusers, and up into valve areas. Wipe surface if needed to confirm questionable staining/buildup. Select all that apply.",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No - ice machine unclean",
      "No - beverage nozzle(s) unclean",
      "No - ice bin(s) unclean",
      "No - other:"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.339",
    "text": "Are in-use utensils properly handled and stored in a sanitary manner?",
    "guidance": "Select all that apply.",
    "pathwayLink": false,
    "options": [],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "LOW"
  },
  {
    "id": "SDC.341",
    "text": "Are non-food contact surfaces clean?",
    "guidance": "Check surfaces of equipment and utensils that do not directly contact food. Select all that apply.",
    "pathwayLink": false,
    "options": [],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "LOW"
  },
  {
    "id": "SDC.343",
    "text": "Are all non-food contact surfaces durable, non-toxic, and in good condition?",
    "guidance": "This question applies to all surfaces in the kitchen that don't touch food such as the handles of utensils, the outside surfaces of pans, shelving, gaskets, lids, etc. Rough surfaces can cause pieces to break off into food and make it difficult to clean. Select NO-OTHER if lemonade/ice cream machine lids are cracked in FOH. Select all that apply.",
    "pathwayLink": false,
    "options": [],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "LOW"
  },
  {
    "id": "SDC.355",
    "text": "Are restrooms fully stocked, clean and in good repair?",
    "guidance": "Select all that apply.",
    "pathwayLink": true,
    "options": [],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "LOW"
  },
  {
    "id": "SDC.361",
    "text": "Are floors, walls, and ceilings smooth, easily cleanable, and in good repair? Are they also free of excessive dust, debris, and standing water?",
    "guidance": "Note - This appears as two separate questions on SAFE (357 and 361).",
    "pathwayLink": true,
    "options": [],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.361.a",
        "text": "Are FLOORS/GROUT smooth, easily cleanable, and in good repair? Are they also free of excessive dust, debris, and standing water?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.361.b",
        "text": "Are BASEBOARDS smooth, easily cleanable, and in good repair? Are they also free of excessive dust, debris, and standing water?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.361.c",
        "text": "Are WALLS smooth, easily cleanable, and in good repair? Are they also free of excessive dust and debris?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.361.d",
        "text": "Are DOORS/WINDOWS smooth, easily cleanable, and in good repair? Are they also free of excessive dust and debris?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.361.e",
        "text": "Are CEILINGS smooth, easily cleanable, and in good repair? Are they also free of excessive dust and debris?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.363",
    "text": "Are vents, fan guards, filters and exhaust hoods clean and in good condition?",
    "guidance": "Select NO if you see soil, dust, grease and/or damage.",
    "pathwayLink": true,
    "options": [],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "LOW"
  },
  {
    "id": "SDC.367",
    "text": "Is lighting adequate in food prep areas and are lights shielded or shatterproof above exposed food, food-contact surfaces, and food packaging?",
    "guidance": "Other: Look at lighting throughout the restaurant, making note of dim lighting or lights not shielded to prevent contamination. Dim lights can also prevent adequate cleaning. Example places to look include thaw cabinets, fry freezer, prep, etc.",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No - light bulbs not protected",
      "No - poor lighting",
      "No - light fixtures covered in debris/dead insects"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "LOW"
  },
  {
    "id": "SDC.369",
    "text": "Are interior garbage cans clean, in good condition, and emptied as needed?",
    "guidance": "Keeping receptacles free of spilled food and liquids is important in helping to prevent pest infestations. Select \"No\" if there's buildup on the outside or inside of the container. Select NO if containers are not leak-proof, rodent-proof, watertight, overflowing or if cardboard boxes are used as containers for trash.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - not cleaned properly",
      "No - not in good condition",
      "No - overflowing"
    ],
    "category": "Cleaning & Sanitation: Surfaces, Equipment",
    "severity": "LOW"
  },
  {
    "id": "SDC.135",
    "text": "Is an accurate food thermometer present?",
    "guidance": "One digital thermometer must be present. The digital thermometer should be working properly and calibrated.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - Food thermometer not present",
      "No - Food thermometer is broken",
      "No - Food thermometer not calibrated"
    ],
    "category": "Time & Temperature: Machines Boards, Reach-in Fridges/Freezers",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.113",
    "text": "Machines: Are grill deflector plates (front/side) properly installed on all grills?",
    "guidance": "",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - front plate not properly installed",
      "No - side skirts not properly installed",
      "Not Observable"
    ],
    "category": "Time & Temperature: Machines Boards, Reach-in Fridges/Freezers",
    "severity": "HIGH"
  },
  {
    "id": "SDC.109",
    "text": "Machines: Are grilled chicken products cooked to 165°F/74°C?",
    "guidance": "* Pathway Link This question is for chicken that just finished cooking. Measure while product is still on the grill or immediately after removing from the grill, wearing blue burn-resistant gloves as necessary. Insert probe from the side between two grill marks. Probe filets in two locations: middle of thickest side and middle of thinnest side (typically the tail or tip). For grilled nuggets, prioritize any nugget that appears thin or flat, pale in color or lack grill marks on either side.",
    "pathwayLink": false,
    "options": [],
    "category": "Time & Temperature: Machines Boards, Reach-in Fridges/Freezers",
    "severity": "IMMEDIATE",
    "children": [
      {
        "id": "SDC.109.a",
        "text": "Machines: Are GRILLED FILETS cooked to 165°F/74°C?",
        "guidance": "Target: 165°F/74°C. Insert probe into edge of thickest part of filet between grill marks. Take an additional reading by inserting probe through edge at tip of filet. Grilled chicken filets are probed twice because if chicken was placed on Garland grill incorrectly, it is possible that part of filet will meet temperature requirement while another part is undercooked.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.109.b",
        "text": "Machines: Are GRILLED NUGGETS cooked to 165°F/74°C?",
        "guidance": "Target: 165°F/74°C. Insert thin portion of probe into center of thickest part, between grill marks, making certain that tip of probe does not stick out the other side. If the nugget meets temp, send to cool-down. If it doesn't meet temp, follow corrective action guidance.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.109.c",
        "text": "Machines: Are GRILLED BREAKFAST FILETS cooked to 165°F/74°C?",
        "guidance": "Target: 165°F/74°C. Insert probe into edge of thickest part of filet between grill marks. Take an additional reading by inserting probe through edge at tip of filet. Grilled chicken filets are probed twice because if chicken was placed on Garland grill incorrectly, it is possible that part of filet will meet temperature requirement while another part is undercooked.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.109.d",
        "text": "Machines: Are SPICY GRILLED FILETS cooked to 165°F/74°C?",
        "guidance": "Target: 165°F/74°C. Insert probe into edge of thickest part of filet between grill marks. Take an additional reading by inserting probe through edge at tip of filet. Grilled chicken filets are probed twice because if chicken was placed on Garland grill incorrectly, it is possible that part of filet will meet temperature requirement while another part is undercooked.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.115",
    "text": "Machines: Are breaded chicken products cooked to 165°F/74°C?",
    "guidance": "This question is for chicken that just finished cooking. Temp right after cooking to ensure proper temperature.",
    "pathwayLink": true,
    "options": [],
    "category": "Time & Temperature: Machines Boards, Reach-in Fridges/Freezers",
    "severity": "IMMEDIATE",
    "children": [
      {
        "id": "SDC.115.a",
        "text": "Machines: Are CHICK-FIL-A FILETS cooked to 165°F/74°C?",
        "guidance": "Target: 165°F/74°C. Insert thermometer into center of the thickest part, making certain that tip of probe does not stick out the other side.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.115.b",
        "text": "Machines: Are BREADED NUGGETS cooked to 165°F/74°C?",
        "guidance": "Target: 165°F/74°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.115.c",
        "text": "Machines: Are CHICK-N-STRIPS cooked to 165°F/74°C?",
        "guidance": "* Pathway Link",
        "pathwayLink": false,
        "options": []
      },
      {
        "id": "SDC.115.d",
        "text": "Machines: Are SPICY FILETS cooked to 165°F/74°C?",
        "guidance": "Target: 165°F/74°C. Insert thermometer into center of the thickest part, making certain that tip of probe does not stick out the other side.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.115.e",
        "text": "Machines: Are BREAKFAST FILETS cooked to 165°F/74°C?",
        "guidance": "Target: 165°F/74°C. Insert thermometer into center of the thickest part, making certain that tip of probe does not stick out the other side.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.115.f",
        "text": "Machines: Are SPICY BREAKFAST FILETS cooked to 165°F/74°C?",
        "guidance": "Target: 165°F/74°C. Insert thermometer into center of the thickest part, making certain that tip of probe does not stick out the other side.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.124",
    "text": "Are proper methods are used to measure the cook temperature of every pan of Mac & Cheese?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Time & Temperature: Machines Boards, Reach-in Fridges/Freezers",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.124.a",
        "text": "Were temperatures measured for every cooked pan of Mac & Cheese?",
        "guidance": "Not applicable for Canada or locations that do not serve Mac & Cheese.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable",
          "Not Applicable"
        ]
      },
      {
        "id": "SDC.124.b",
        "text": "Were temperatures measured in the center of the pan?",
        "guidance": "*",
        "pathwayLink": false,
        "options": []
      }
    ]
  },
  {
    "id": "SDC.125",
    "text": "Boards: Are the following items cooked or reheated to proper temperatures?",
    "guidance": "This question is for items that have just finished the cooking or reheating process. Temp products right after cooking/reheating to ensure proper temperature.",
    "pathwayLink": true,
    "options": [],
    "category": "Time & Temperature: Machines Boards, Reach-in Fridges/Freezers",
    "severity": "IMMEDIATE",
    "children": [
      {
        "id": "SDC.125.a",
        "text": "Boards: Is MAC & CHEESE cooked or reheated to proper temperatures?",
        "guidance": "Cook to 165°F/74°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.125.b",
        "text": "Boards: Is CHEESE SAUCE cooked or reheated to proper temperatures?",
        "guidance": "Cook to 165°F/74°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.125.c",
        "text": "Boards: Is CHICKEN NOODLE SOUP WITH CHICKEN ADDED cooked or reheated to proper temperatures?",
        "guidance": "After chicken is added, the soup should temp at or above 165°F/74°C.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.125.d",
        "text": "Boards: Is SOUP BASE, CHICKEN NOODLE cooked or reheated to proper temperatures?",
        "guidance": "Reheat to 190°F/88°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.125.e",
        "text": "Boards: Is CHICKEN TORTILLA SOUP WITH CHICKEN ADDED cooked or reheated to proper temperatures?",
        "guidance": "After chicken is added, the soup should temp at or above 165°F/74°C.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.125.f",
        "text": "Boards: Is SOUP BASE, TORTILLA SOUP cooked or reheated to proper temperatures?",
        "guidance": "Reheat to 190°F/88°C",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.125.g",
        "text": "Boards: Are SCRAMBLED EGGS cooked or reheated to proper temperatures?",
        "guidance": "Cook to 145°F/63°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.125.j",
        "text": "Boards: Are FOLDED EGGS cooked or reheated to proper temperatures?",
        "guidance": "Cook to 145°F/63°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.125.h",
        "text": "Boards: Is SAUSAGE cooked or reheated to proper temperatures?",
        "guidance": "Cook to 165°F/74°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.105",
    "text": "Boards: Are the following hot items held at 140°F/60°C or above?",
    "guidance": "This question is for items in hot holding at Boards.",
    "pathwayLink": true,
    "options": [],
    "category": "Time & Temperature: Machines Boards, Reach-in Fridges/Freezers",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.105.a",
        "text": "Boards: Are CHICK-FIL-A FILETS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.b",
        "text": "Boards: Are BREADED NUGGETS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.c",
        "text": "Boards: Are CHICK-N-STRIPS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.d",
        "text": "Boards: Are SPICY FILETS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.e",
        "text": "Boards: Are GRILLED FILETS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.f",
        "text": "Boards: Are GRILLED NUGGETS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.g",
        "text": "Boards: Is CHICKEN NOODLE SOUP in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.h",
        "text": "Boards: Is CHICKEN TORTILLA SOUP in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.i",
        "text": "Boards: Is MAC & CHEESE in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.r",
        "text": "Boards: Is CHEESE SAUCE in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.j",
        "text": "Boards: Are SCRAMBLED EGGS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.k",
        "text": "Boards: Are FOLDED EGGS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.l",
        "text": "Boards: Are BREAKFAST FILETS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.m",
        "text": "Boards: Are SPICY BREAKFAST FILETS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.n",
        "text": "Boards: Are GRILLED BREAKFAST FILETS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.p",
        "text": "Boards: Is SAUSAGE in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.105.q",
        "text": "Boards: Are HASH BROWNS in hot holding held at 140°F/60°C or above?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.141",
    "text": "Are foods properly date labeled when prepared/opened?",
    "guidance": "Check for labels on TCS foods such as sliced/chopped produce, cheese, prepared items (e.g. salads), etc that are prepped or open.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No",
      "Not Observable"
    ],
    "category": "Time & Temperature: Machines Boards, Reach-in Fridges/Freezers",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.129",
    "text": "Are all TCS/PHF foods held or sold prior to the expiration date?",
    "guidance": "expired Check labels on items located in this assessment's areas of focus. (e.g. thawing chicken, prepared products, thawed sausage, green leaf, cheese, and sliced tomatoes.) Select NO if the product label is expired or if the item is held beyond the manufacturer expiration date. For filleted raw chicken, select NO If the 24-hour label is the only label present and is expired (there should be two labels: 24-hr and 96-hr).",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - Food past use-by date on label",
      "No - Food past manufacturer expiration date",
      "No - 24-hr label on filleted raw chicken is the only label present and is"
    ],
    "category": "Time & Temperature: Machines Boards, Reach-in Fridges/Freezers",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.133",
    "text": "Is Time as a Public Health Control (TPHC) procedure (if applicable) properly followed?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Time & Temperature: Machines Boards, Reach-in Fridges/Freezers",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.133.a",
        "text": "Is TPCH used for approved foods only?",
        "guidance": "Not Relevant to my Restaurant TPHC procedures can only be used with sliced cheese (American, Colby-Jack, and Pepper-Jack), cut tomatoes and cut Green Leaf lettuce. Do not use this method for milk and egg wash, other salad ingredients, chicken products or any hot held products.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.133.b",
        "text": "Are TPHC labels used properly?",
        "guidance": "Not Relevant to my Restaurant",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.133.c",
        "text": "Is the TPHC tracking log properly in use?",
        "guidance": "Not Relevant to my Restaurant",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.133.d",
        "text": "Is TPHC food discarded after 4 hours?",
        "guidance": "Not Relevant to my Restaurant",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.129",
    "text": "Are all TCS/PHF foods held or sold prior to the expiration date?",
    "guidance": "expired Check labels on items located in this assessment's areas of focus. (e.g. thawing chicken, prepared products, thawed sausage, green leaf, cheese, and sliced tomatoes.) Select NO if the product label is expired or if the item is held beyond the manufacturer expiration date. For filleted raw chicken, select NO If the 24-hour label is the only label present and is expired (there should be two labels: 24-hr and 96-hr).",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - Food past use-by date on label",
      "No - Food past manufacturer expiration date",
      "No - 24-hr label on filleted raw chicken is the only label present and is"
    ],
    "category": "Time & Temperature: Freezer, Thaw Cabinet, Holding Cabinet, Breading Table",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.121",
    "text": "Holding Cabinet: Is raw chicken in the holding cabinet 33°F-40°F (1°C-4°C) for breaded and 35°F-40°F (2°C-4°C) for grilled?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Time & Temperature: Freezer, Thaw Cabinet, Holding Cabinet, Breading Table",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.121.i",
        "text": "Holding Cabinet: Is MILK AND EGG WASH in the holding cabinet maintained at 40°F/4°C or below?",
        "guidance": "Target: 40°F/4°C and below",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.121.a",
        "text": "Holding Cabinet: Are raw CHICK-FIL-A FILETS in the holding cabinet 33°F-40°F (1°C-4°C)?",
        "guidance": "Target range: 33°F-40°F (1°C-4°C)",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.121.b",
        "text": "Holding Cabinet: Are raw NUGGETS in the holding cabinet 33°F-40°F (1°C-4°C)?",
        "guidance": "Target range: 33°F-40°F (1°C-4°C)",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.121.c",
        "text": "Holding Cabinet: Are raw CHICK-N-STRIPS in the holding cabinet 33°F-40°F (1°C-4°C)?",
        "guidance": "Target range: 33°F-40°F (1°C-4°C)",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.121.d",
        "text": "Holding Cabinet: Are raw SPICY FILETS in the holding cabinet 33°F-40°F (1°C-4°C)?",
        "guidance": "Target range: 33°F-40°F (1°C-4°C)",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.121.h",
        "text": "Holding Cabinet: Are raw SPICY BREAKFAST FILETS in the holding cabinet 33°F-40°F (1°C-4°C)?",
        "guidance": "Target range: 33°F-40°F (1°C-4°C)",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.121.g",
        "text": "Holding Cabinet: Are raw BREAKFAST FILETS in the holding cabinet 33°F-40°F (1°C-4°C) ?",
        "guidance": "Target range: 33°F-40°F (1°C-4°C)",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.121.e",
        "text": "Holding Cabinet: Are raw GRILLED FILETS in the holding cabinet 35°F-40°F (2°C-4°C)?",
        "guidance": "Target Range: 35°F-40°F (2°C-4°C)",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.121.f",
        "text": "Holding Cabinet: Are raw GRILLED NUGGETS in the holding cabinet 35°F-40°F (2°C-4°C)?",
        "guidance": "Target Range: 35°F-40°F (2°C-4°C)",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.121.j",
        "text": "Holding Cabinet: Are raw GRILLED BREAKFAST FILETS in the holding cabinet 35°F-40°F (2°C-4°C)?",
        "guidance": "Target Range: 35F-40°F (2°C-4°C)",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.123",
    "text": "Breading Table: Are raw breaded chicken products held in the rail of the breading table at 33°F-40°F/1°C-4°C?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Time & Temperature: Freezer, Thaw Cabinet, Holding Cabinet, Breading Table",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.123.g",
        "text": "Breading Table: Is MILK AND EGG WASH held in the rail of the breading table at 33°F-40°F/1°C-4°C?",
        "guidance": "Target: 33°F-40°F/1°C-4°C?",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.123.a",
        "text": "Breading Table: Are raw CHICK-FIL-A FILETS held in the rail of the breading table at 33°F-40°F/1°C-4°C?",
        "guidance": "Target Range: 33°F-40°F/1°C-4°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.123.b",
        "text": "Breading Table: Are raw NUGGETS held in the rail of the breading table at 33°F-40°F/1°C-4°C?",
        "guidance": "Target Range: 33°F-40°F/1°C-4°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.123.e",
        "text": "Breading Table: Are raw BREAKFAST FILETS held in the rail of the breading table at 33°F-40°F/1°C-4°C?",
        "guidance": "Target Range: 33°F-40°F/1°C-4°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.123.d",
        "text": "Breading Table: Are raw SPICY FILETS held in the rail of the breading table at 33°F-40°F/1°C-4°C?",
        "guidance": "Target Range: 33°F-40°F/1°C-4°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.123.f",
        "text": "Breading Table: Are raw SPICY BREAKFAST FILETS held in the rail of the breading table at 33°F-40°F/1°C-4°C?",
        "guidance": "Target Range: 33°F-40°F/1°C-4°C",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.135",
    "text": "Is an accurate food thermometer present?",
    "guidance": "One digital thermometer must be present. The digital thermometer should be working properly and calibrated.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - Food thermometer not present",
      "No - Food thermometer is broken",
      "No - Food thermometer not calibrated"
    ],
    "category": "Time & Temperature: Walk-in Cooler, Prep, Front of House",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.139",
    "text": "Walk-in Cooler: Are foods received at proper temperatures and food packages received in good condition?",
    "guidance": "Since it's difficult to assess this process happening in the moment, consider checking in with the person who received the shipment/put it away and review any records. Scan packages for damage.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No",
      "Not Observable"
    ],
    "category": "Time & Temperature: Walk-in Cooler, Prep, Front of House",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.126",
    "text": "Are perforated pans being used to cool down chopped romaine?",
    "guidance": "Not Relevant at my Restaurant Not Observable Not applicable for Canada, Puerto Rico, and for restaurants not serving salad.",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Time & Temperature: Walk-in Cooler, Prep, Front of House",
    "severity": "HIGH"
  },
  {
    "id": "SDC.127",
    "text": "Walk-in Cooler: (US/PR) Are TCS foods cooled from 140°F to 70°F or below within 2 hours and from 140°F to 40°F or below within 6 hours? Are proper date/time stickers in use? Are proper date/time stickers in use?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Time & Temperature: Walk-in Cooler, Prep, Front of House",
    "severity": "IMMEDIATE",
    "children": [
      {
        "id": "SDC.127.a",
        "text": "Are proper date/time labels used when cooling BREADED CHICKEN?",
        "guidance": "Determine that date label is present and contains the date and time.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.127.b",
        "text": "Walk-in Cooler: (US/PR) Is BREADED CHICKEN cooled from 140°F to 70°F or below within 2 hours and from 140°F to 40°F or below within 6 hours?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No - temperature greater than 70°F (21°C) after 2 hours",
          "No - temperature greater than 40°F (4°C) after 6 hours",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.127.c",
        "text": "Are proper date/time labels used when cooling GRILLED CHICKEN?",
        "guidance": "Determine that date label is present and contains the date and time.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.127.d",
        "text": "Walk-in Cooler: (US/PR) Is GRILLED CHICKEN cooled from 140°F to 70°F or below within 2 hours and from 140°F to 40°F or below within 6 hours?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No - temperature greater than 70°F (21°C) after 2 hours",
          "No - temperature greater than 40°F (4°C) after 6 hours",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.127.e",
        "text": "Are proper date/time labels used when cooling SOUP?",
        "guidance": "*",
        "pathwayLink": false,
        "options": []
      },
      {
        "id": "SDC.127.f",
        "text": "Walk-in Cooler: (US/PR) Is SOUP cooled from 140°F to 70°F or below within 2 hours and from 140°F to 40°F or below within 6 hours?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No - temperature greater than 70°F (21°C) after 2 hours",
          "No - temperature greater than 40°F (4°C) after 6 hours",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.127.g",
        "text": "Are proper date/time labels used when cooling MAC & CHEESE?",
        "guidance": "Determine that date label is present and contains the date and time.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.127.h",
        "text": "Walk-in Cooler: (US/PR) Is MAC & CHEESE cooled from 140°F to 70°F or below within 2 hours and from 140°F to 40°F or below within 6 hours?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No - temperature greater than 70°F (21°C) after 2 hours",
          "No - temperature greater than 40°F (4°C) after 6 hours",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.127.i",
        "text": "Are proper date/time labels used when cooling CHEESE SAUCE?",
        "guidance": "Determine that date label is present and contains the date and time.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.127.j",
        "text": "Walk-in Cooler: (US/PR) Is CHEESE SAUCE cooled from 140°F to 70°F or below within 2 hours and from 140°F to 40°F or below within 6 hours?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No - temperature greater than 70°F (21°C) after 2 hours",
          "No - temperature greater than 40°F (4°C) after 6 hours",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.128",
    "text": "Walk-in Cooler and Freezer: Is the chicken cool-down process properly followed?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Time & Temperature: Walk-in Cooler, Prep, Front of House",
    "severity": "MEDIUM",
    "children": [
      {
        "id": "SDC.128.a",
        "text": "Walk-in Cooler and Freezer: Is the chicken cool-down process properly followed for BREADED CHICKEN?",
        "guidance": "",
        "pathwayLink": false,
        "options": []
      },
      {
        "id": "SDC.128.b",
        "text": "Walk-in Cooler and Freezer: Is the chicken cool-down process properly followed for GRILLED CHICKEN?",
        "guidance": "",
        "pathwayLink": false,
        "options": []
      }
    ]
  },
  {
    "id": "SDC.141",
    "text": "Are foods properly date labeled when prepared/opened?",
    "guidance": "Check for labels on TCS foods such as sliced/chopped produce, cheese, prepared items (e.g. salads), etc that are prepped or open.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No",
      "Not Observable"
    ],
    "category": "Time & Temperature: Walk-in Cooler, Prep, Front of House",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.129",
    "text": "Are all TCS/PHF foods held or sold prior to the expiration date?",
    "guidance": "expired Check labels on items located in this assessment's areas of focus. (e.g. thawing chicken, prepared products, thawed sausage, green leaf, cheese, and sliced tomatoes.) Select NO if the product label is expired or if the item is held beyond the manufacturer expiration date. For filleted raw chicken, select NO If the 24-hour label is the only label present and is expired (there should be two labels: 24-hr and 96-hr).",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - Food past use-by date on label",
      "No - Food past manufacturer expiration date",
      "No - 24-hr label on filleted raw chicken is the only label present and is"
    ],
    "category": "Time & Temperature: Walk-in Cooler, Prep, Front of House",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.201",
    "text": "Are foods and food-contact surfaces protected from contamination during preparation and serving?",
    "guidance": "Look for foods not properly covered to prevent contamination. Look for issues such as dripping condensation, chipping paint on the ceiling above exposed food, heavy frost/ice buildup on items in the freezer, etc. Food items can be stored in a single-use, labeled container but it can only be used once and then should be discarded (e.g. Do not reuse the plastic bowl that held shredded soup chicken over and over).",
    "pathwayLink": false,
    "options": [],
    "category": "Cross-contamination Part 1",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.201.a",
        "text": "Are foods held in storage properly covered to protect from contamination?",
        "guidance": "Items may be left uncovered or loosely covered during the cooling process only. Whole fruits and vegetables that will be washed or peeled do not have to be covered. Examples of improperly covered foods: tea or lemonade urns without lids, sugar bin left open, storing filleted raw chicken uncovered in holding cabinet.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.201.b",
        "text": "Are sanitizer buckets stored on the floor?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.201.c",
        "text": "Are flies landing on ready-to-eat food?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.201.d",
        "text": "Are foods, food packaging/utensils stored or held on trashcans?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.201.e",
        "text": "Is condensation present above exposed food or food-contact surfaces?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.201.f",
        "text": "Are hands touching food contact surfaces or utensils?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.203",
    "text": "Is cross-contamination prevented during food storage and preparation?",
    "guidance": "",
    "pathwayLink": false,
    "options": [],
    "category": "Cross-contamination Part 1",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.203.b",
        "text": "Are Team Members wearing yellow apron/gloves while working with ready-to-eat foods?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.203.i",
        "text": "Are dirty yellow aprons touching clean items?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.203.a",
        "text": "Are chemical containers stored above or next to food/food contact surfaces or gloves?",
        "guidance": "Select YES if chemicals (opened or closed) are stored above or next to food or food-contact surfaces (including food handler gloves). Examples: Urnex Tabz containers are stored above/beside the tea brewers, as they are toxic. Kay Release should be stored separate from chemicals and is safe to be stored with food or above the breading table. Although wipe containers with lids are low risk compared to an open chemical containers or spray bottles, they should be treated like other chemicals.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.203.g",
        "text": "Are any physical hazards stored above food or food contact surfaces?",
        "guidance": "Look for anything on that could fall into food such as personal items, dust, magnets, etc.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.203.c",
        "text": "Are sanitizer towels designated for the breading table used in other areas of the restaurant?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.203.e",
        "text": "Is washed produce stored in the carton it came in?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.203.h",
        "text": "Is quick thawing happening in the compartment sink while dishes are being washed or stored?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.203.j",
        "text": "Are there any other possible sources of cross-contamination present?",
        "guidance": "Examples: Kanban of cooked food or food contact utensil is placed on or is contaminated by a raw surface; mac and cheese is found in a thaw cabinet that's currently thawing or previously thawed raw chicken; fryer handle is placed on the front shelf of the Henny Penny that has NOT been sanitized after transfer pan was set on it; and medicines/first aid supplies are stored where they may contaminate food/surfaces.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.203.f",
        "text": "Did you find any contaminated foods?",
        "guidance": "As you walk through scan pans and trays throughout the Restaurant, look for physical contaminants.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.205",
    "text": "Are foods stored so that cross-contamination is prevented (e.g. food hierarchy)?",
    "guidance": "Food storage hierarchy is a system for organizing food in a refrigerator or cooler to minimize the risk of cross-contamination.",
    "pathwayLink": false,
    "options": [],
    "category": "Cross-contamination Part 1",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.205.a",
        "text": "Is milk and egg wash stored above or next to ready-to-eat (RTE) foods?",
        "guidance": "Look in the walk-in cooler and reach-in refrigerators. Note - It's recommended to store milk and egg wash in the walk-in cooler and not reach-in refrigerators.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.205.b",
        "text": "Is raw chicken stored above or next to ready-to-eat (RTE) foods?",
        "guidance": "Ideally raw chicken should be stored in dedicated thaw cabinets and holding cabinets. If needed to store raw chicken in the walk-in, it should be stored below or on separate shelving away from cooked/ready-to-eat foods to prevent cross-contamination.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.205.c",
        "text": "Is milk and egg wash stored below raw chicken?",
        "guidance": "Check the holding cabinet, walk-in cooler and anywhere else where both products may be stored together. If milk and egg wash is stored in same refrigerator as raw chicken, position raw chicken below milk and egg wash to avoid cross-contamination from raw chicken juices dripping onto milk and egg wash container.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.229",
    "text": "In thaw cabinets, are the correct \"Use-First\" clips used for each type of chicken?",
    "guidance": "Use First clips should be used for each raw chicken type in thaw cabinets. Approved clips are yellow silicone, yellow plastic, and etched metal. Approved Use First Clips should be used for each type of raw chicken thawing in cabinets. Unapproved clip types: Paper clips/document clips, metal or plastic chains attached to any kind of clip, metal clips with lettering punched out. Chains are not permitted inside the thaw cabinet.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No - clips not used at all",
      "No - clips occasionally used",
      "No - wrong type of clips used",
      "Not Observable"
    ],
    "category": "Cross-contamination Part 1",
    "severity": "LOW"
  },
  {
    "id": "SDC.225",
    "text": "Is the sewage system, including grease traps, operating properly?",
    "guidance": "If sewage backup cannot immediately be contained and cleaned up, it could contaminate food or equipment. Sewage carries a high risk of organisms that can cause diseases. For this reason, a Restaurant cannot operate with a sewage backup.",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cross-contamination Part 2",
    "severity": "IMMEDIATE"
  },
  {
    "id": "SDC.227",
    "text": "Is clean water available in the Restaurant?",
    "guidance": "Also known as potable or drinking water.",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cross-contamination Part 2",
    "severity": "IMMEDIATE"
  },
  {
    "id": "SDC.207",
    "text": "Are foods from approved suppliers and packaging in good condition?",
    "guidance": "Look in the walk-in cooler and reach-in refrigerators to answer the following questions.",
    "pathwayLink": true,
    "options": [],
    "category": "Cross-contamination Part 2",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.207.a",
        "text": "Is produce only from approved suppliers and not sourced from a local grocery store?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.207.d",
        "text": "Are there damaged cans or packaging present?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.207.e",
        "text": "Is there moldy food present?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.207.f",
        "text": "Are there homemade products present?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.217",
    "text": "Are foods labeled with the product name on the container?",
    "guidance": "",
    "pathwayLink": false,
    "options": [],
    "category": "Cross-contamination Part 2",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.217.a",
        "text": "Do bulk dry ingredients have a name label?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.217.b",
        "text": "Do bottles of liquid ingredients have a name label?",
        "guidance": "Examples: Bun oil, Release Agent for grill",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.215",
    "text": "Is produce properly washed prior to chopping and serving? Is produce wash properly set up and used?",
    "guidance": "Why Important? There is no subsequent kill step: cleaning produce with antimicrobial produce wash is a primary step to control hazards and reduce the potential for cross contamination. This process is required for Romaine lettuce (whole), strawberries, and tomatoes (grape and 6x6). Lemons require only rinsing and do not require produce wash to be used. The quality of the produce will be impacted if the produce wash concentration is too high or low.",
    "pathwayLink": true,
    "options": [],
    "category": "Cross-contamination Part 2",
    "severity": "IMMEDIATE",
    "children": [
      {
        "id": "SDC.215.a",
        "text": "Are strawberries, grape tomatoes, bulk romaine (Canada and Puerto Rico only), and whole 6x6 tomatoes washed in produce wash before chopping?",
        "guidance": "Your restaurant may not receive bulk romaine or whole 6x6 tomatoes. Romaine filets and pre-sliced tomatoes do not need to be washed with produce wash. Washing produce in the original container can lead to cross-contamination.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No - produce washed not used",
          "No - washed in original container",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.215.b",
        "text": "Is produce soaking in water alone?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.215.c",
        "text": "Are strawberries, grape tomatoes, bulk romaine (Canada only) and whole 6x6 tomatoes submerged in produce wash for 90 seconds?",
        "guidance": "If produce is not currently being washed, select \"Not Observable.\" Answer the question based on the products you receive. For example, you may not receive bulk romaine and whole 6x6 tomatoes.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.215.d",
        "text": "Are lemons rinsed with cold running water before chopping?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.215.e",
        "text": "Are romaine lettuce outer leaves removed and discarded?",
        "guidance": "Select \"Not Observable\" if your Restaurant does not receive bulk romaine.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.215.f",
        "text": "Are romaine lettuce bases cut off after being washed in produce wash?",
        "guidance": "Select \"Not Observable\" if the restaurant does not receive bulk romaine.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.219",
    "text": "Are foods and food-contact items stored at least six inches off the floor?",
    "guidance": "This includes food, equipment, utensils, single-use and single-service items (e.g. packaging, napkins, gloves)",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Cross-contamination Part 2",
    "severity": "LOW"
  },
  {
    "id": "SDC.221",
    "text": "Are chemicals, produce wash, and chemical containers used correctly and only for their intended purpose?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Cross-contamination Part 2",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.221.a",
        "text": "Are container(s) previously used for chemicals used for storing, dispensing, or transporting food?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.221.b",
        "text": "Are chemical(s) used correctly and only for intended purposes?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.221.c",
        "text": "Is the produce wash the Chick-fil-A approved Antimicrobial Fruit and Vegetable Treatment?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.235",
    "text": "Is the CFA Bodily Fluid Clean-up Kit assembled and easily accessible?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Cross-contamination Part 2",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.235.a",
        "text": "Are all the components present?",
        "guidance": "Required Components: - Chick-fil-A Disinfectant (Kay Insta-Use, Kay Peroxide, or Purell Surface Sanitizer) - Rubbermaid Over the Spill Pads - Multifold Towels - Clear Disposable Gloves - White Disposable Apron - Black Trash Compactor Bags -Cleaning Instructions",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.235.b",
        "text": "Are all components stored together?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.235.c",
        "text": "Are all components easily accessible?",
        "guidance": "Answer NO if the kits are not in a location available to all Team Members.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.235.d",
        "text": "Are all the components within the expiration date?",
        "guidance": "Required Components with an expiration date: Chick-fil-A Disinfectant (Kay Insta-Use, Kay Peroxide, or Purell Surface Sanitizer)",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.239",
    "text": "Are tamper-evident delivery stickers being used on mobile orders for 3rd party deliveries?",
    "guidance": "After verifying the 3rd party delivery order with the driver, the Team Member should seal each paper bag with a tamper-evident delivery sticker. If tamper-evident stickers are on back-order, Cookie Stickers are an acceptable substitution.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No",
      "Not Observable"
    ],
    "category": "Cross-contamination Part 2",
    "severity": "LOW"
  },
  {
    "id": "SDC.243",
    "text": "Are Allergen and Nutrition info available in the restaurant?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Cross-contamination Part 2",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.243.a",
        "text": "Are allergen clings present and located in the correct locations?",
        "guidance": "Allergen Disclaimer window cling is displayed for Customer notification and transparency (not required for LCVs or Canada locations) - FSU & Inline Restaurants: Present on each entry door and in Drive-Thru Window. Additional placement between POS optional. - Malls: Present between each POS on counter - DTOs: Present on Drive-Thru window and each walk-up ordering window (if applicable)",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.243.b",
        "text": "Can a team member locate the nutrition information on the POS or CFA app?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.243.c",
        "text": "Can a team member locate the allergen information on the POS or CFA app?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.410",
    "text": "Does the restaurant have a written/digital health policy covering foodborne and severe respiratory illnesses?",
    "guidance": "The purpose of this question is to ensure the Restaurant has a robust health policy to meet FDA Food Code and Chick-fil-A Operational Requirements Guide (ORG) requirements.",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Team Members",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.410.a",
        "text": "Does the restaurant have a written/digital health policy?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.410.b",
        "text": "Does the restaurant's health policy cover both foodborne and severe respiratory illnesses?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.413",
    "text": "Can the person-in-charge demonstrate knowledge of health protocols?",
    "guidance": "This question helps ensure that at least one leader on shift knows your restaurant health policy protocols.",
    "pathwayLink": false,
    "options": [],
    "category": "Health & Hygiene: Team Members",
    "severity": "MEDIUM",
    "children": [
      {
        "id": "SDC.413.a",
        "text": "What are the reportable foodborne illness diagnoses that would require exclusion?",
        "guidance": "Select all illnesses the Leader was able to list. Consider asking several Team Members this question as well.",
        "pathwayLink": false,
        "options": []
      },
      {
        "id": "SDC.413.b",
        "text": "Name one symptom that should result in being excluded/sent home.",
        "guidance": "Select all symptoms the Leader (Person in Charge) is able to list. Consider asking several Team Members this question as well.",
        "pathwayLink": false,
        "options": []
      }
    ]
  },
  {
    "id": "SDC.701",
    "text": "Are Team Members being health screened before work?",
    "guidance": "The Operational Requirements Guide (ORG) requires that all Restaurants screen Team Member for illness before working. It is up to the Operator to determine the best screening method.",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Health & Hygiene: Team Members",
    "severity": "HIGH"
  },
  {
    "id": "SDC.409",
    "text": "Are sick/symptomatic Team Members excluded from working in the restaurant?",
    "guidance": "The purpose of this question is to ensure no sick Team Members are working and the Restaurant's health policy is followed.",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Team Members",
    "severity": "IMMEDIATE",
    "children": [
      {
        "id": "SDC.409.a",
        "text": "Are any Team Members showing signs of illness?",
        "guidance": "Look for symptoms such as vomiting, diarrhea, jaundice (yellowing of eyes or skin), fever, sore throat with fever, lesions containing pus (such as a boil), infected wound or burn that is open or draining, sudden loss of taste or smell, or sudden onset of shortness of breath.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.409.b",
        "text": "Were Team Member(s) diagnosed with an illness sent home or not permitted to work?",
        "guidance": "Anyone diagnosed with the following illnesses or others by a doctor are not permitted to work (excluded): Norovirus, Hep. A, Shigella, Salmonella, E. coli, COVID-19, the Flu, etc. See Restaurant health policy for more information.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.419",
    "text": "Do Team Members have clean, trimmed nails/nail polish in good taste with no fake nails? Are BOH Team Members wearing gloves over nail polish when handling food or in food prep areas?",
    "guidance": "This question helps ensure good hand hygiene to prevent cross-contamination while handling food.",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Team Members",
    "severity": "MEDIUM",
    "children": [
      {
        "id": "SDC.419.a",
        "text": "Are Team Member nails neatly trimmed?",
        "guidance": "Fingernails must not extend beyond fingertips when viewed from the open palm.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.419.b",
        "text": "Are any Team Members wearing fake nails?",
        "guidance": "False fingernails and fingernail gems are not permitted.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.419.d",
        "text": "Are Team Members wearing fingernail gems?",
        "guidance": "Fingernail gems are not acceptable in the Restaurant.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.419.f",
        "text": "In the back of house, are gloves worn over nail polish in food prep areas or when handling food?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.425",
    "text": "Are Team Members wearing hair restraints when required and only approved jewelry?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Team Members",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.425.a",
        "text": "Are beard nets worn over facial hair in food prep/storage area?",
        "guidance": "Team Members with facial hair longer than ¼ inch must wear a beard net when in a food prep role or in any food service role that requires the use of gloves.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.425.b",
        "text": "Are Team Members in food prep roles/areas wearing an effective hair restraint?",
        "guidance": "Effective hair restraints (e.g., hair accessories, hats, visors, hairnets, Chick-fil-A chef hats) must be worn to hold back any loose hair that could potentially fall into food. Hair that falls around face must be tied back and restrained using a hair accessory that has no jeweled or beaded parts that could come loose.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.425.c",
        "text": "Are food handlers wearing watches/bracelets/wrist braces?",
        "guidance": "Wristwatches and medical alert bracelets must be conservative in size and appearance and free from attached decoration or gemstones. Watches and medical alert bracelets must not be worn in food prep areas; watches and bracelets make it difficult to properly wash hands and forearms, and contaminants can get caught in bands. Medical alert bracelet may be kept in pocket.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.425.d",
        "text": "Is any food handler wearing a ring with stones?",
        "guidance": "Rings are limited to a plain band without gemstones, such as a wedding band. When worn in food prep areas, food service gloves must be worn over ring to avoid food contamination or catching on equipment.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.403",
    "text": "Is a yellow apron properly worn when working with raw chicken?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Team Members",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.403.a",
        "text": "Is a yellow apron worn when handling raw chicken?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.411",
    "text": "Does the Operator have a current ServSafe certificate posted in the restaurant?",
    "guidance": "Check the current date printed on the lower half of the certificate to determine if it is valid (within 5 years)",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Health & Hygiene: Team Members",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.801",
    "text": "PUERTO RICO: Are health certificates for Operators and Team Members current within 1-year of issuance by an authorized physician and maintained on file?",
    "guidance": "",
    "pathwayLink": false,
    "options": [],
    "category": "Health & Hygiene: Team Members",
    "severity": "MEDIUM"
  },
  {
    "id": "SDC.417",
    "text": "Are Front of House and Back of House hand-washing sinks stocked, accessible, properly used, clean and in good condition?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.417.a",
        "text": "Are any items stored in hand sinks?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.417.b",
        "text": "Are any items blocking access to hand sinks?",
        "guidance": "Examples to look for include boxes, bread racks, etc.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.417.c",
        "text": "Do you see any food, utensils, equipment, wiping cloths, etc. being rinsed/washed in hand sinks?",
        "guidance": "",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.417.d",
        "text": "Are pitchers or other containers filled at hand sinks?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.417.e",
        "text": "Are hand sinks clean?",
        "guidance": "Look for encrusted food and debris buildup that may indicate that the sink was not cleaned recently.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.417.f",
        "text": "Are hand sinks stocked with soap?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.417.g",
        "text": "Are hand sinks stocked with towels?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.417.h",
        "text": "Is there a hand-washing reminder sign at hand sinks?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.417.i",
        "text": "Is there a trash can near hand sinks?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.417.j",
        "text": "Is the water in hand sinks 100F and above?",
        "guidance": "Use a thermometer to test water temperature at every hand sink.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.421",
    "text": "Is hot and cold water available with adequate water pressure at all sinks?",
    "guidance": "compartment sink) No - inadequate water pressure No - water/cold water not available at dish machine, hand sinks, or restrooms Run hot water at the compartment sink and temp to ensure the temperature reaches 110F/43C within 60 seconds. Check water pressure at the compartment sink and ensure hot and cold water is available at hand sinks and in the restroom.",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No - hot water ≥ 110F/43C not present (in restaurant or at"
    ],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "IMMEDIATE"
  },
  {
    "id": "SDC.401",
    "text": "Are hands washed properly according to procedure and at the appropriate times?",
    "guidance": "Take a moment to observe the operation and make note of hand-washing habits.",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "IMMEDIATE",
    "children": [
      {
        "id": "SDC.401.j",
        "text": "Did you observe hands being washed properly?",
        "guidance": "Look for rinsing with water; using soap; scrubbing between fingers, under nails and up forearms for 20 seconds; rinsing, and drying. Hands should be dried with a clean paper towel. The paper towel should be used to turn off the water. If any step is missing or not completed accurately, select NO.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.401.c",
        "text": "Did you see hands being washed after leaving the restroom and before returning to work?",
        "guidance": "Hands should be washed in the restroom and again in the work area.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.401.d",
        "text": "Did you see a Team Member washing their hands after entering the kitchen and before returning to food prep?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.401.e",
        "text": "Did you observe hands washed when returning to food prep from a break?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.401.f",
        "text": "Did you observe hands being washed after coughing or sneezing?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.401.g",
        "text": "Did you observe hands washed after touching face, hair, body, or people?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.401.i",
        "text": "Did you observe hands washed before putting on gloves?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.401.h",
        "text": "Did you observe hands washed when changing tasks?",
        "guidance": "Wash hands and change gloves after touching unclean surfaces, after handling raw or uncooked foods, before leaving your work zone, and after handling chemicals.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.405",
    "text": "Is bare hand contact prevented with ready-to-eat foods?",
    "guidance": "There should be no bare hand contact with cooked/ready-to-eat food or raw chicken. Look for examples like a Team Member touching fries while bagging. NOTE: Unwashed produce and biscuit dough are not considered ready-to-eat foods and therefore do not require gloves while handling (unless nail polish is present).",
    "pathwayLink": true,
    "options": [
      "Yes",
      "No"
    ],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "IMMEDIATE"
  },
  {
    "id": "SDC.407",
    "text": "Are yellow and clear gloves worn at appropriate times and used properly?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.407.a",
        "text": "Are yellow gloves worn when handling raw chicken at the breading table?",
        "guidance": "Yellow gloves should only be worn when working with raw chicken. This includes handling raw chicken, bags of raw chicken and designated metal raw chicken trays, metal pans and metal utensils.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.407.b",
        "text": "Are yellow gloves worn when handling raw chicken in the walk-in cooler/freezer?",
        "guidance": "Yellow gloves should only be worn when working with raw chicken. This includes handling raw chicken, bags of raw chicken and designated metal raw chicken trays, metal pans and metal utensils.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.407.c",
        "text": "Are clear gloves worn when handling rinsed produce?",
        "guidance": "Wear clear gloves to handle produce after it is rinsed.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.407.d",
        "text": "Are clear gloves worn over cut/cloth gloves?",
        "guidance": "Clear gloves should be worn over gray cut resistant gloves.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.407.e",
        "text": "Are gloves worn over bandages?",
        "guidance": "Gloves should be worn over bandaged cuts on hands.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.407.f",
        "text": "Are Team Member gloves free of rips/holes?",
        "guidance": "Gloves should be changed as soon as they become torn or dirty.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.423",
    "text": "Is there proper eating, drinking, tobacco use and storage of personal items?",
    "guidance": "This questions ensures that these behaviors do not cause cross-contamination risks in food preparation and service areas.",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.423.a",
        "text": "Are Team Member drinks properly covered and stored?",
        "guidance": "* Pathway Link",
        "pathwayLink": false,
        "options": []
      },
      {
        "id": "SDC.423.b",
        "text": "Are Team Member personal items (clothing, purses, coats, speakers, etc.) stored away from food-contact surfaces and food preparation areas?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.423.c",
        "text": "Is vaping/tobacco use restricted to areas away from exposed food, food-contact surfaces, packaging, and equipment?",
        "guidance": "* Pathway Link",
        "pathwayLink": false,
        "options": []
      },
      {
        "id": "SDC.423.d",
        "text": "Is eating done away from exposed food, food-contact surfaces, packaging, and food-contact equipment?",
        "guidance": "Chewing gum, toothpicks or tobacco are considered eating.",
        "pathwayLink": false,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.713",
    "text": "Are hand sanitizer stations easily accessible to Customers?",
    "guidance": "This questions helps ensure that the operational requirement to provide hand sanitizer to Customers is met.",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.713.a",
        "text": "Are Customer hand sanitizer stations present and accessible?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      },
      {
        "id": "SDC.713.b",
        "text": "Are Customer hand sanitizer stations stocked?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No",
          "Not Observable"
        ]
      }
    ]
  },
  {
    "id": "SDC.501",
    "text": "Is the pest prevention program effective for rodents, live cockroaches, birds in the restaurant or pests in food?",
    "guidance": "Look for live or dead rodents/cockroaches, droppings, gnawed packing, rodent nests, etc.",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "IMMEDIATE",
    "children": [
      {
        "id": "SDC.501.a",
        "text": "Do you see 1 or more live cockroaches inside the restaurant?",
        "guidance": "Walk the entire restaurant and grounds. Look in corners, behind equipment, in storage areas, dumpster area, etc.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.501.b",
        "text": "Do you see 1 or more rodents in the restaurant?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.501.c",
        "text": "Do you see rodent droppings in the Restaurant?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.501.d",
        "text": "Do you see any packaging that has been gnawed open by rodents?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.501.e",
        "text": "Do you see any signs of rodent nesting?",
        "guidance": "Rodents prefer nesting in secluded areas like behind equipment, in walls/ceilings, and storage areas. Look for nests or piles of shredded paper, cardboard, scraps, etc.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.501.f",
        "text": "Is there a bird trapped in the restaurant?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.501.g",
        "text": "Are any pests present in food?",
        "guidance": "Scan all containers and pans for the presence of pests (e.g. coolers, dry storage, cold rail, etc.)",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.503",
    "text": "Is the pest prevention program effective for flies and ants inside the restaurant and birds outside the restaurant?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "HIGH",
    "children": [
      {
        "id": "SDC.503.a",
        "text": "Do you see 3 or more flies in one area of the Restaurant?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.503.b",
        "text": "Do you see 3 or more dead cockroaches?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.503.c",
        "text": "Do you see 10 or more ants in one area?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.503.d",
        "text": "Do you see trailing ants in food service areas?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.503.e",
        "text": "Do you see a bird(s) nesting on the exterior of the building?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.509",
    "text": "Is pest activity prevented through proper sealing of outer openings and the elimination of harborage conditions?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.509.a",
        "text": "Are gaps beneath all exterior doors less than 1/4 inch?",
        "guidance": "* Pathway Link",
        "pathwayLink": false,
        "options": []
      },
      {
        "id": "SDC.509.b",
        "text": "Are gaps around pipes/ductwork less than 1/4 inch?",
        "guidance": "Look closely at areas around pipes (e.g. sinks, equipment, water heater, etc.) and exposed ductwork (e.g. vent hoods, air conditioning ventilation) for holes. Select NO if holes are larger than 1/4 inch (approximately the width of a pencil).",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.509.c",
        "text": "Are all areas inside and outside the restaurant free of excessive debris/clutter where insects can breed?",
        "guidance": "Visit areas in and around the restaurant (e.g. dumpster, storage areas). Look for clutter such as empty boxes, broken equipment, trash, food debris, leaves and anything else that could attract/harbor pests.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.509.d",
        "text": "Are mops and brooms hung to dry?",
        "guidance": "Look for mops and brooms sitting on the floor. Floor cleaning tools on the ground can harbor pests.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.509.e",
        "text": "Are any doors left propped open when not in use?",
        "guidance": "Look for any exterior doors that are propped/left open with no Team Members coming in or out. This includes drive thru doors, doors that open to shared hallways and doors that open to the outside.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.513",
    "text": "Are INTERIOR pest control devices working and properly installed to prevent contamination of food?",
    "guidance": "This question also covers INTERIOR pest control devices that are improperly designed to contain pests, insect devices that are placed in areas that could contaminate surfaces, and insect devices that are not emptied often to prevent buildup. If these issues are noticed, follow up with leadership and notify your pest provider.",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.513.a",
        "text": "Are pest control devices installed over food prep or food storage areas?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.513.b",
        "text": "Are insect light traps broken, not plugged in or off?",
        "guidance": "N/A - Mall, Licensee, Captive Venue",
        "pathwayLink": true,
        "options": [
          "Yes - Broken",
          "Yes - Switched Off",
          "Yes - Not plugged in",
          "No"
        ]
      },
      {
        "id": "SDC.513.c",
        "text": "Are all air curtains turned on and functioning properly?",
        "guidance": "* Pathway Link",
        "pathwayLink": false,
        "options": []
      },
      {
        "id": "SDC.513.d",
        "text": "Are any pest control devices/traps destroyed and not able to work effectively?",
        "guidance": "Look for dented, crushed, or otherwise damaged traps that may prevent them from properly trapping pests.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.514",
    "text": "Are EXTERIOR pest control devices working and properly installed to prevent contamination of food?",
    "guidance": "1 Rodent Bait Station is placed in each of the following locations: Dumpster corral, each side of drive thru door, and each side of receiving door.",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.514.a",
        "text": "Are EXTERIOR bait stations present and functioning properly?",
        "guidance": "N/A - Mall, Licensee, Captive Venue",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.514.b",
        "text": "Are EXTERIOR bait stations free of accumulation of pests?",
        "guidance": "N/A - Mall, Licensee, Captive Venue",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.517",
    "text": "Is exterior garbage storage covered, free of excessive debris, and maintained in good repair?",
    "guidance": "",
    "pathwayLink": true,
    "options": [],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "LOW",
    "children": [
      {
        "id": "SDC.517.a",
        "text": "Are all dumpster lids closed?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.517.b",
        "text": "Is the dumpster area cleaned with no excessive debris?",
        "guidance": "* Pathway Link",
        "pathwayLink": false,
        "options": []
      },
      {
        "id": "SDC.517.c",
        "text": "Is the dumpster drain plug in place?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.517.d",
        "text": "Is the grease recycling container properly cleaned?",
        "guidance": "",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.517.e",
        "text": "Are dumpsters in good condition?",
        "guidance": "Look for broken lids, cracks, etc. that could let pests in.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      },
      {
        "id": "SDC.517.f",
        "text": "Is garbage properly stored inside containers so that it does not attract pests?",
        "guidance": "Select NO if garbage is overflowing. For shared dumpsters, select NO if CFA trash is observed.",
        "pathwayLink": true,
        "options": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "id": "SDC.521",
    "text": "Does the pest control management company inspect and treat the Restaurant monthly for cockroaches and rodents?",
    "guidance": "N/A - Licensee, Captive Venue Review monthly records from previous quarter. Confirm that inspections occur approximately every 30 days since last Pest Control Service visit. Reports must include results of the visit and details of any actions taken for both cockroaches and rodents. Exclusions: Licensees, Captive Venues.",
    "pathwayLink": false,
    "options": [
      "Yes",
      "No - Report detailing findings and corrective actions unavailable",
      "No - Inspections occur more than 30 days apart",
      "No - Program doesn't cover cockroaches and/or rodents"
    ],
    "category": "Health & Hygiene: Handwashing, Gloves",
    "severity": "MEDIUM"
  }
];
