--- SQL SCHEMA FOR climate.db

-- states table
CREATE TABLE IF NOT EXISTS states (
    "state_id" INTEGER PRIMARY KEY,
    "state_name" TEXT
);

-- regions table
CREATE TABLE IF NOT EXISTS regions (
    "region_id" INTEGER PRIMARY KEY,
    "region_name" TEXT,
    "state_id" INTEGER,
    FOREIGN KEY ("state_id") REFERENCES states ("state_id")
);

-- weather_stations table
CREATE TABLE IF NOT EXISTS weather_stations (
    "site_id" INTEGER PRIMARY KEY,
    "name" TEXT,
    "lat" REAL,
    "long" REAL,
    "state_id" INTEGER,
    "region_id" INTEGER,
    FOREIGN KEY ("state_id") REFERENCES states ("state_id"),
    FOREIGN KEY ("region_id") REFERENCES regions ("region_id")
);


-- quality_metadata table
CREATE TABLE IF NOT EXISTS quality_metadata (
    "quality_flag" TEXT PRIMARY KEY,
    "description" TEXT
);

-- bom_data_metadata table
CREATE TABLE IF NOT EXISTS bom_data_metadata (
    "field" TEXT,
    "description" TEXT
);


-- bom_data table
CREATE TABLE IF NOT EXISTS bom_data (   
    "Location" INTEGER,         
    "DMY"  TEXT,
    "Precipitation" REAL,       
    "PrecipQual" TEXT,        
    "RainDaysNum" INTEGER,         
    "RainDaysMeasure" INTEGER,         
    "Evaporation" REAL,       
    "EvapQual" TEXT,        
    "EvapDaysNum" INTEGER,         
    "MaxTemp" REAL,       
    "MaxTempQual" TEXT,        
    "MaxTempDays" INTEGER,         
    "MinTemp" REAL,       
    "MinTempQual" TEXT,        
    "MinTempDays" INTEGER,         
    "Humid00" INTEGER,         
    "Humid00Qual"  TEXT,        
    "Humid03" INTEGER,         
    "Humid03Qual" TEXT,        
    "Humid06" INTEGER,         
    "Humid06Qual" TEXT,        
    "Humid09" INTEGER,         
    "Humid09Qual" TEXT,        
    "Humid12" INTEGER,         
    "Humid12Qual" TEXT,        
    "Humid15" INTEGER,         
    "Humid15Qual" TEXT,        
    "Humid18" INTEGER,         
    "Humid18Qual" TEXT,        
    "Humid21" INTEGER,         
    "Humid21Qual" TEXT,        
    "Sunshine" REAL,       
    "SunshineQual" TEXT,        
    "Okta00" INTEGER,         
    "Okta00Qual" TEXT,        
    "Okta03" INTEGER,         
    "Okta03Qual" TEXT,        
    "Okta06" INTEGER,         
    "Okta06Qual" TEXT,        
    "Okta09" INTEGER,         
    "Okta09Qual" TEXT,        
    "Okta12" INTEGER,         
    "Okta12Qual" TEXT,        
    "Okta15" INTEGER,         
    "Okta15Qual" TEXT,        
    "Okta18" INTEGER,         
    "Okta18Qual" TEXT,        
    "Okta21" INTEGER,         
    "Okta21Qual" TEXT, 
    PRIMARY KEY ("Location", "DMY"),
    FOREIGN KEY ("PrecipQual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("EvapQual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("MaxTempQual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("MinTempQual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Humid00Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Humid03Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Humid06Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Humid09Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Humid12Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Humid15Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Humid18Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Humid21Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("SunshineQual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Okta00Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Okta03Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Okta06Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Okta09Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Okta12Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Okta15Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Okta18Qual") REFERENCES quality_metadata ("quality_flag"),
    FOREIGN KEY ("Okta21Qual") REFERENCES quality_metadata ("quality_flag")
);

-- students table
CREATE TABLE IF NOT EXISTS students (
    "student_id" TEXT PRIMARY KEY,
    "student_name" TEXT
);

INSERT INTO students (student_id, student_name)
VALUES 
    ("s4153182", "Lucas Wong"),
    ("s4183218", "Sai Akella");


-- personas table
CREATE TABLE IF NOT EXISTS personas (
    "persona_id" INTEGER PRIMARY KEY,
    "name" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "occupation" TEXT,
    "background" TEXT,
    "goals" TEXT,
    "needs" TEXT, -- input skills as JSON array painful at start but will be easy for retrival 
    "skills" TEXT, -- input skills as JSON array painful at start but will be easy for retrival
    "image_path" TEXT -- best to keep the images stored locally and add there path to database to keep the database light
);

INSERT INTO personas ("name", "age", "gender", "occupation", "background", "goals", "needs", "skills", "image_path")
VALUES
    (
        "James Bond", 
        45, 
        "Male", 
        "Risk Analyst at an Insurance Firm", "James is responsible for evaluating risk expose across multiple regions in Australia. He frequently uses weather and environmental data to inform premium calculations, forecast insurance payouts, and make decisions on regional underwriting.",
        '["Identify high-risk zones for natural disasters like bushfires, floods, and storms.","Make data-backed decisions to adjust policies or premium rates.","Monitor evolving climate-related threats in near real-time."]',
        '["Access to recent and historical weather data for specific locations.","Ability to compare data across different areas to identify emerging risk trends.","Downloadable reports and summaries to include in internal models and presentations."]',
        '["Advanced data interpretation tools usage.","High digital literacy and frequent use of dashboards.","Comfortable with advanced analytics but expects clear UI/UX."]',
        "./static/imgs/personas/persona_1.jpeg"
    ),
    (
        "Georgia Hanson",
        38,
        "Female",
        "Wildlife Conservation Officer",
        "Georgia is a works for an environmental protection agency. She monitors habitat health and climate trends in protected regions across Australia. Her works includes tracking how long-term weather changes are affecting vulnerable species and ecosystems. She frequently needs to identify patterns of environmental change to guide policy recommendations, plan conservation activities, prepare emergency responses and allocate limited resources.",
        '["Identify weather stations with climate trends like key locations e.g. national parks or species hotpots.","Compare how climate variables change over time.","Use similarity metrics to identify regions experiencing similar climate change patterns."]',
        '["Select custom time ranges to examine how metrics have shifted.","Choose a reference station and find others with similar rates of change using multiple metrics.","Receive clear visual and tabular summaries showing how and why stations are considered similar."]',
        '["Familiar with Gov databases, research portals and field monitoring tools.","Strong background in environmental science.","Experienced with data dashboards and basic data interpretation."]',
        "./static/imgs/personas/persona_2.jpeg"
    ),
    (
        "Jeffrey Summer",
        56,
        "Male",
        "Farmer",
        "Jeffrey left school after year 10 to work on his family farm in Melbourne’s regional western suburbs. He lives with his wife and spends most of his time managing the farm. He has 2 sons who moved interstate and started their own families. He is quite traditional and dislikes the changes that he feels around him.",
        '["Find a simple website that will output data he is looking for.","Compare how current weather differs from his youth so that he can adjust his current practises.","Print out the data to have on hand."]',
        '["A simple, intuitive website that will be easy to use and understand.","The ability to compare current weather trends to trends from his youth.","Ability to download and print data outputs."]',
        '["Very little experience with computers and current technology, prefers paper over digital.","Well organised, able to identify useful information quickly.","Strongly opinionated and able to draw own conclusions quickly.","Enjoys growing and trimming hedges into various shapes."]',
        "./static/imgs/personas/persona_3.jpeg"

    ),
    (
        "Angela Nomoni",
        26,
        "Female",
        "Infrastructure Planner",
        "Angela is a Bachelor of Architecture graduate currently working for the Victorian government in urban development. Angela moved to Melbourne from Sydney to study and find employment and currently lives alone. Angela spent time while studying doing exchange programs overseas and wants to incorporate foreign infrastructure into her planning.",
        '["Track changes in changing weather patterns to design infrastructure that will be resilient to future conditions i.e. heavier rain leads to increased traffic congestion.","Update previous infrastructure based off how climate metrics in relation to each other have changed from when they were constructed i.e. precipitation increased more than evaporation leading to flooding."]',
        '["A website that can output data aggregated by time period.","Automatic computation of the changes in climate metrics.","Data that can compare previous conditions to current conditions."]',
        '["High computer literacy, able to understand large amounts of data.","Experience in how different climates affect design choices.","Comfortable using data to inform design decisions.","Regularly shops second hand and is experienced in negotiating."]',
        "./static/imgs/personas/persona_4.jpeg"
    );



