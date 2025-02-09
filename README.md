# IFSC Calendar Scraper

This project is a Node.js script that scrapes the International Federation of Sport Climbing (IFSC) calendar and generates an ICS file containing all climbing competitions for the year 2025. The generated calendar can be imported into most calendar applications (Google Calendar, Apple Calendar, Outlook, etc.).

## Features

- Scrapes competition data from the official IFSC website
- Extracts event dates, locations, and climbing disciplines
- Generates an ICS file compatible with major calendar applications
- Handles both single-day events and multi-day competitions
- Supports events spanning across different months

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/Almyk/ifsc
cd ifsc
```

2. Install the required dependencies:
```bash
npm install
```

## Usage

Run the script using Node.js:

```bash
node scrape-ifsc.js
```

The script will:
1. Fetch the competition calendar from the IFSC website
2. Parse the event information
3. Generate an ICS file named `ifsc-2025.ics` in the project directory

You can then import the generated `ifsc-2025.ics` file into your preferred calendar application.

## Dependencies

- `axios`: For making HTTP requests to the IFSC website
- `cheerio`: For parsing and extracting data from HTML
- `ical-generator`: For generating the ICS calendar file

## Contributing

Feel free to submit issues and enhancement requests! 