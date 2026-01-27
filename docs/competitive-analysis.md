# Phase 1.1a): Sector Analysis: Board Game Tracking & Scoring Tools

## 1. Market Classification
> **Market Definition:** Board game recording and scoring tools. The market is dominated by mobile applications that seek to replace pen and paper, almost always integrating with the BoardGameGeek (BGG) database.

We have selected **5 key competitors** that represent the different threats to the **TabletopMastering** project:

* **Board Game Stats (BG Stats):** The undisputed leader (Netherlands). B2C Single payment + DLCs. The standard for advanced users.
* **ScorePal:** Veteran competitor on Android. B2C Freemium. Focused on scoring logic and "smart sheets".
* **BGG Catalog:** Lightweight/Open Source solutions. B2C Free. Simple collection managers linked to BGG.
* **Board Record (Boardlog):** Indie Startup. B2C Freemium. Focused on data visualization and extreme customization.
* **BoardGameGeek (BGG):** The big platform (The "Notion" of the sector). B2B/B2C Free with ads. The original database of the entire hobby.

---

## 2. Organizational Characteristics Analysis

### Board Game Stats (BG Stats)
It is the "World Anvil" of this sector. A personal project by a developer (Eerko Visscher) that has become the gold standard. Very professional and polished.
* **Team:** < 5 (Mainly founder + community support).
* **Technology:** Native development (iOS and Android optimized separately), proprietary cloud synchronization and BGG API.

### ScorePal
Veteran application created to solve the complexity of calculating points in difficult games (e.g., Agricola). Development has slowed in recent years.
* **Team:** 1-2 (Indie Dev).
* **Technology:** Native Android (Java/Kotlin). Strong focus on local databases and logic scripts.

### Board Record (Boardlog)
The modern and flexible competitor. Positioned as the powerful alternative for users who want to "dig into" data.
* **Team:** < 5 (Indie Hacker).
* **Technology:** Android, modular approach where the user defines what data to view.

### BoardGameGeek (The Platform)
The big corporation (recently acquired by investment groups, maintains community management).
* **The Threat:** They don't have a perfect native app, but they own the data. If they launched a modern official app, they would dominate the sector instantly.

---

## 3. Competitive Comparison

| Company | Revenue Model | Strengths | Weaknesses | Tech Stack (Est.) |
| :--- | :--- | :--- | :--- | :--- |
| **BG Stats** | Paid App + DLCs <br>*(Optional Cloud Subscription)* | Very polished UX. Impeccable import/export. Constant support. | Fragmented pricing model (Base app + "Deep Stats" + "Challenges"). | Swift (iOS), Java/Kotlin (Android) |
| **ScorePal** | Freemium (Pro Key) | Step-by-step scoring assistants (Game logic vs. just sums). | Visually outdated interface. High learning curve. | Native Android |
| **Board Record**| Freemium | Superior data visualization (charts, pies). Highly customizable. | Can overwhelm casual users. Less focus on UI aesthetics. | Android / Flutter (or similar) |
| **BGG Catalog** | Free / Donation | Simple and straightforward. Ideal for inventory management. | Very limited in match logging. Often web wrappers. | Hybrid / Web Wrappers |
| **BGG (Web)** | Ads / Donations | Infinite database. Massive community. | UX/UI from the 2000s. Slow on mobile. Requires connection. | PHP (Legacy), MySQL |

---

## 4. Product and Pricing Analysis

### Unique Value Proposition (UVP)
* **BG Stats:** "Quantify your hobby". Treats board gaming as a sport with serious statistics.
* **ScorePal:** "Forget about math". Helps calculate results during the game, not just save them.
* **Board Record:** "Your data, your way". Personal data mining and complex graphs.

### Pricing Structure

| Company | Model | Free Plan | Monthly Cost (Approx) | Lifetime Purchase Option |
| :--- | :--- | :--- | :--- | :--- |
| **BG Stats** | Paid App + IAP | No (Only very basic Lite) | ~$1 USD (Cloud) | Yes, ~$5 App + ~$8 Expansions |
| **ScorePal** | Freemium | Yes (Limited features) | N/A | Yes, ~$3 - $5 USD (Key) |
| **Board Record**| Freemium | Yes (With ads/limits) | N/A | Yes, ~$4 - $6 USD |

---

## 5. Opportunity Validation for "TabletopMastering"

### The "All-in-One" Gap
The analysis confirms a clear opportunity against the leader, **BG Stats**.
* **Current friction:** BG Stats charges for the app, then charges extra for "Deep Stats" and extra for "Challenges". This creates user rejection.
* **Solution:** A **True Single Payment** model (everything unlocked) at an intermediate price ($8-$10) is very attractive.
* **Entry barrier:** There is a gap for an app that is **visually beautiful** (LegendKeeper style) but easy to use from day one, moving away from Board Record's complexity or ScorePal's outdatedness.

### Key Functional Opportunities

#### 1. "Social First" and Sharing (The Visual Opportunity)
* **Problem:** Competitors generate functional but unattractive or technical graphs. Sharing a victory on Instagram Stories requires basic screenshots.
* **Opportunity:** Become the leading tool for "Flexing" (Showing off). Automatically generate designed images for social media after each match ("I won at Terraforming Mars!"). **Aesthetics over pure statistics.**

#### 2. Player Gamification (Meta-game)
* **Problem:** Current apps are "glorified spreadsheets". Recording is passive.
* **Opportunity:** Introduce **Achievements and Level System**. Give badges for "Playing 5 days in a row" or "Trying 3 new games". Make using the app a game in itself.

#### 3. "Party & Group" Mode
* **Problem:** Only one person records the match; other players don't get the record on their phones.
* **Opportunity:** **"Lobby" system with QR code**. The owner opens the match, generates a QR, and friends scan to have the match recorded on their profiles instantly. Group synchronization without friction.
