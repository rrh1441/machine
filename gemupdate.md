<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seattle Ball Machine | The Club Experience</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
    
    <style>
        /* --- THE COUNTRY CLUB PALETTE --- */
        :root {
            --club-green: #1a472a;  /* Deep Forest Green */
            --club-cream: #fdfbf7;  /* Off-White / Paper */
            --court-clay: #c06045;  /* Subtle Terracotta Accent */
            --tennis-yellow: #dfff4f; /* Pop color for buttons */
            --rich-black: #111111;
            --border-color: #e5e5e5;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--club-cream);
            color: var(--rich-black);
            font-family: 'Source Sans 3', sans-serif;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        h1, h2, h3, .serif-font {
            font-family: 'Playfair Display', serif;
        }

        /* --- NAVIGATION --- */
        nav {
            padding: 25px 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--club-green);
            background: var(--club-cream);
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: var(--club-green);
            text-transform: uppercase;
        }

        .nav-btn {
            background-color: var(--club-green);
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            border-radius: 2px; /* Square corners for classic look */
            transition: background 0.3s;
        }

        .nav-btn:hover {
            background-color: #265c3a;
        }

        /* --- HERO SECTION --- */
        .hero {
            position: relative;
            padding: 80px 5%;
            min-height: 80vh;
            display: flex;
            align-items: center;
            background-color: var(--club-cream);
        }

        .hero-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            max-width: 1200px;
            margin: 0 auto;
            align-items: center;
        }

        .hero-text h1 {
            font-size: 4rem;
            line-height: 1.1;
            color: var(--club-green);
            margin-bottom: 25px;
        }

        .hero-text p {
            font-size: 1.25rem;
            color: #555;
            margin-bottom: 35px;
            max-width: 450px;
        }

        /* The Hero Image Frame - "Polaroid" Style */
        .hero-image-wrapper {
            position: relative;
        }

        .hero-img {
            width: 100%;
            height: 550px;
            object-fit: cover;
            /* Using a lifestyle image, not a machine product shot */
            background: url('https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop') center/cover;
            border: 1px solid var(--rich-black);
            box-shadow: 15px 15px 0px var(--club-green); /* Retro hard shadow */
        }

        /* --- CTA BUTTONS --- */
        .btn-main {
            display: inline-block;
            background-color: var(--club-green);
            color: white;
            padding: 18px 40px;
            font-size: 1.1rem;
            text-decoration: none;
            font-weight: 600;
            border: 2px solid var(--club-green);
            transition: all 0.3s;
        }

        .btn-main:hover {
            background-color: transparent;
            color: var(--club-green);
            transform: translate(-3px, -3px);
            box-shadow: 3px 3px 0 rgba(26, 71, 42, 0.2);
        }

        /* --- "WHY IT MATTERS" (Benefits) --- */
        .benefits {
            padding: 100px 5%;
            max-width: 1000px;
            margin: 0 auto;
            text-align: center;
        }

        .section-label {
            color: var(--court-clay);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 0.9rem;
            margin-bottom: 15px;
            display: block;
        }

        .benefits h2 {
            font-size: 3rem;
            color: var(--club-green);
            margin-bottom: 60px;
        }

        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 50px;
            text-align: left;
        }

        .benefit-card h3 {
            font-size: 1.8rem;
            margin-bottom: 15px;
            position: relative;
            padding-bottom: 15px;
        }

        .benefit-card h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 3px;
            background-color: var(--court-clay);
        }

        .benefit-card p {
            font-size: 1.1rem;
            color: #444;
        }

        /* --- THE "HOW IT WORKS" STRIP --- */
        .process {
            background-color: var(--club-green);
            color: var(--club-cream);
            padding: 80px 5%;
        }

        .process-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 40px;
        }

        .process-step {
            flex: 1;
            min-width: 250px;
            border-left: 1px solid rgba(255,255,255,0.2);
            padding-left: 25px;
        }

        .process-step span {
            font-family: 'Playfair Display', serif;
            font-size: 4rem;
            opacity: 0.3;
            line-height: 1;
            display: block;
            margin-bottom: 10px;
        }

        .process-step h4 {
            font-size: 1.4rem;
            margin-bottom: 10px;
            font-weight: 600;
        }

        /* --- PRICING --- */
        .pricing {
            padding: 100px 5%;
            text-align: center;
        }

        .pricing-card {
            background: white;
            border: 2px solid var(--club-green);
            max-width: 500px;
            margin: 0 auto;
            padding: 50px;
            position: relative;
        }

        .pricing-card::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 1px solid #ddd;
            pointer-events: none;
        }

        .price {
            font-family: 'Playfair Display', serif;
            font-size: 3.5rem;
            color: var(--club-green);
            margin: 20px 0;
        }

        .price span {
            font-size: 1rem;
            font-family: 'Source Sans 3', sans-serif;
            color: #666;
        }

        /* --- MOBILE --- */
        @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr; gap: 30px; }
            .hero-text h1 { font-size: 3rem; }
            .hero-img { height: 300px; }
            .process-container { flex-direction: column; }
            .process-step { border-left: none; border-top: 1px solid rgba(255,255,255,0.2); padding-left: 0; padding-top: 20px; }
        }
    </style>
</head>
<body>

    <nav>
        <div class="logo">Seattle Ball Machine</div>
        <a href="#" class="nav-btn">Reserve Court Time</a>
    </nav>

    <section class="hero">
        <div class="hero-grid">
            <div class="hero-text">
                <span class="section-label">Serving Queen Anne & Seattle</span>
                <h1>Your Perfect Hitting Partner.</h1>
                <p>Always on time. Never judges your backhand. Ready when you are. Experience the best practice session of your life.</p>
                <a href="#" class="btn-main">Book Your Session</a>
                <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.7;"><em>*Fits in the passenger seat of any car.</em></p>
            </div>
            <div class="hero-image-wrapper">
                <div class="hero-img"></div>
            </div>
        </div>
    </section>

    <section class="benefits">
        <span class="section-label">Why Rent?</span>
        <h2>Less Hassle. More Tennis.</h2>
        
        <div class="benefits-grid">
            <div class="benefit-card">
                <h3>The "Flake" Factor</h3>
                <p>Partners cancel. Traffic happens. The machine is always ready to go. Book a lane, pick it up, and hit 500 balls in an hour.</p>
            </div>
            
            <div class="benefit-card">
                <h3>Groove Your Stroke</h3>
                <p>You can't fix a backhand hitting one every 5 minutes. You need repetition. Set the drill, lock in, and build muscle memory.</p>
            </div>

            <div class="benefit-card">
                <h3>A Cardio Beast</h3>
                <p>Want to sweat? Set the "Sweeps" drill. It runs you corner to corner until you drop. Better than a treadmill, way more fun.</p>
            </div>
        </div>
    </section>

    <section class="process">
        <div class="process-container">
            <div class="process-step">
                <span>01</span>
                <h4>Book Online</h4>
                <p>Select your time slot. No phone calls, no membership fees required.</p>
            </div>
            <div class="process-step">
                <span>02</span>
                <h4>Pickup</h4>
                <p>Grab the machine from our Queen Anne location. It's lightweight and portable.</p>
            </div>
            <div class="process-step">
                <span>03</span>
                <h4>Play</h4>
                <p>Control everything from your phone. Spin, speed, and drills at a tap.</p>
            </div>
        </div>
    </section>

    <section class="pricing">
        <div class="pricing-card">
            <h3>Standard Rental</h3>
            <div class="price">$40 <span>/ session</span></div>
            <p>Includes full machine access, charger, and premium pressureless balls.</p>
            <br>
            <a href="#" class="btn-main" style="width: 100%; text-align: center;">Check Availability</a>
        </div>
    </section>

    <footer style="padding: 40px; text-align: center; border-top: 1px solid #ddd; margin-top: 40px;">
        <p class="serif-font" style="font-size: 1.2rem; color: var(--club-green); font-weight: bold;">Seattle Ball Machine</p>
        <p style="font-size: 0.9rem; margin-top: 10px; color: #666;">© 2026. Keep your eye on the ball.</p>
    </footer>

</body>
</html>