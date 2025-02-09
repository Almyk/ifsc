import ical from 'ical-generator';
import axios from "axios";
import * as cheerio from "cheerio";
import fs from 'fs';

async function scrapeIFSCCalendar() {
    const calendar = ical({
        name: 'IFSC Calendar 2025',
        timezone: 'UTC'
    });

    try {
        const response = await axios.get('https://www.ifsc-climbing.org/calendar/index');
        const $ = cheerio.load(response.data);

        // Find all event cards
        $('.card__event-horizontal').each((index, element) => {
            const $event = $(element);
            
            // Extract event details
            const dateText = $event.find('.flex.items-center.gap-1').first().text().trim(); // Date is in the first flex container
            const location = $event.find('h4').text().trim();
            const title = location; // Use location as title since it contains the full event name
            
            // Get disciplines from the icons
            const disciplines = $event.find('.flex.items-center.gap-1')
                .eq(1) // Get the second flex container with icons
                .find('img')
                .map((_, img) => $(img).attr('alt'))
                .get()
                .join(', ');

            console.log('Found event:', { dateText, title, location, disciplines }); // Debug log

            // Parse date range with improved regex that handles month-spanning dates
            const dateMatch = dateText.match(/(\d{1,2})(?:([A-Za-z]+)|-)(\d{1,2})?([A-Za-z]+)?\s*(\d{4})/);
            
            if (!dateMatch) {
                console.warn(`Could not parse date for event: ${title} (${dateText})`);
                return;
            }

            let startDay, startMonth, endDay, endMonth, year;
            
            if (dateMatch[2]) { // Single day or same month
                [, startDay, startMonth, , , year] = dateMatch;
                endDay = dateMatch[3];
                endMonth = startMonth;
            } else { // Spanning months
                [, startDay, , endDay, endMonth, year] = dateMatch;
                startMonth = endMonth;
            }
            
            // Create start and end dates
            const startDate = new Date(`${startMonth} ${startDay}, ${year}`);
            let endDate;
            
            if (endDay) {
                endDate = new Date(`${endMonth} ${endDay}, ${year}`);
                // Add one day to include the end date
                endDate.setDate(endDate.getDate() + 1);
            } else {
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 1);
            }

            // Validate dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.warn(`Invalid date for event: ${title}`);
                return;
            }

            // Add event to calendar
            calendar.createEvent({
                start: startDate,
                end: endDate,
                summary: title,
                description: `Disciplines: ${disciplines}`,
                location: location,
                allDay: true
            });
            
            console.log(`Added event: ${title} (${dateText})`); // Debug logging
        });

        // Save to file
        fs.writeFileSync('./ifsc-2025.ics', calendar.toString());
        console.log('Calendar file generated successfully!');

    } catch (error) {
        console.error('Error scraping calendar:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

scrapeIFSCCalendar();

