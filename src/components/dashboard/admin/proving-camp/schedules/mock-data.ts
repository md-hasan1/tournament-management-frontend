// import type { Participant, SchedulePeriod, SchedulePeriodInput, Season } from "./types";

// const seasonRanges: Record<Season, string> = {
//   Summer: "Jun",
//   Winter: "Jan",
//   Spring: "Mar",
//   Fall: "Sep",
// };

// export function buildSchedulePeriod(input: SchedulePeriodInput, id?: string): SchedulePeriod {
//   const scheduleId = id ?? `schedule-${Date.now()}`;
//   const weekCount = input.weekRanges.length;

//   return {
//     id: scheduleId,
//     name: input.name,
//     season: input.season,
//     startDate: input.weekRanges[0]?.startDate ?? `${seasonRanges[input.season]} 1, 2027`,
//     endDate:
//       input.weekRanges[weekCount - 1]?.endDate ?? `${seasonRanges[input.season]} ${weekCount * 7}, 2027`,
//     weeks: input.weekRanges.map((range, index) => ({
//       id: `${scheduleId}-week-${index + 1}`,
//       title: `Week ${index + 1}`,
//       dateLabel: `${range.startDate} - ${range.endDate}`,
//       status: "Active",
//       am: {
//         ageLabel: "Ages 8-10",
//         enrolled: Math.min(40 + (index % 8), 50),
//         capacity: 50,
//       },
//       pm: {
//         ageLabel: "Ages 11-14",
//         enrolled: Math.min(46 + (index % 5), 50),
//         capacity: 50,
//       },
//     })),
//   };
// }

// export const initialSchedules: SchedulePeriod[] = [
//   {
//     id: "schedule-summer-2026",
//     name: "Summer 2026 Camp",
//     season: "Summer",
//     startDate: "Jun 2, 2026",
//     endDate: "Aug 1, 2026",
//     weeks: [
//       { id: "w1", title: "Week 1", dateLabel: "Jun 2-6", status: "Active", am: { ageLabel: "Ages 8-10", enrolled: 48, capacity: 50 }, pm: { ageLabel: "Ages 11-14", enrolled: 50, capacity: 50 } },
//       { id: "w2", title: "Week 2", dateLabel: "Jun 9-13", status: "Active", am: { ageLabel: "Ages 8-10", enrolled: 50, capacity: 50 }, pm: { ageLabel: "Ages 11-14", enrolled: 50, capacity: 50 } },
//       { id: "w3", title: "Week 3", dateLabel: "Jun 16-20", status: "Active", am: { ageLabel: "Ages 8-10", enrolled: 47, capacity: 50 }, pm: { ageLabel: "Ages 11-14", enrolled: 49, capacity: 50 } },
//       { id: "w4", title: "Week 4", dateLabel: "Jun 23-27", status: "Active", am: { ageLabel: "Ages 8-10", enrolled: 48, capacity: 50 }, pm: { ageLabel: "Ages 11-14", enrolled: 50, capacity: 50 } },
//       { id: "w5", title: "Week 5", dateLabel: "Jun 30-Jul 4", status: "Active", am: { ageLabel: "Ages 8-10", enrolled: 50, capacity: 50 }, pm: { ageLabel: "Ages 11-14", enrolled: 50, capacity: 50 } },
//       { id: "w6", title: "Week 6", dateLabel: "Jul 7-11", status: "Active", am: { ageLabel: "Ages 8-10", enrolled: 50, capacity: 50 }, pm: { ageLabel: "Ages 11-14", enrolled: 48, capacity: 50 } },
//       { id: "w7", title: "Week 7", dateLabel: "Jul 14-18", status: "Active", am: { ageLabel: "Ages 8-10", enrolled: 46, capacity: 50 }, pm: { ageLabel: "Ages 11-14", enrolled: 50, capacity: 50 } },
//       { id: "w8", title: "Week 8", dateLabel: "Jul 21-25", status: "Active", am: { ageLabel: "Ages 8-10", enrolled: 48, capacity: 50 }, pm: { ageLabel: "Ages 11-14", enrolled: 49, capacity: 50 } },
//       { id: "w9", title: "Week 9", dateLabel: "Jul 28-Aug 1", status: "Active", am: { ageLabel: "Ages 8-10", enrolled: 45, capacity: 50 }, pm: { ageLabel: "Ages 11-14", enrolled: 47, capacity: 50 } },
//     ],
//   },
//   buildSchedulePeriod(
//     {
//       name: "Winter 2027 Camp",
//       season: "Winter",
//       weekRanges: [
//         { startDate: "Jan 4", endDate: "Jan 8" },
//         { startDate: "Jan 11", endDate: "Jan 15" },
//         { startDate: "Jan 18", endDate: "Jan 22" },
//         { startDate: "Jan 25", endDate: "Jan 29" },
//         { startDate: "Feb 1", endDate: "Feb 5" },
//         { startDate: "Feb 8", endDate: "Feb 12" },
//       ],
//     },
//     "schedule-winter-2027",
//   ),
//   buildSchedulePeriod(
//     {
//       name: "Spring 2027 Camp",
//       season: "Spring",
//       weekRanges: [
//         { startDate: "Mar 15", endDate: "Mar 19" },
//         { startDate: "Mar 22", endDate: "Mar 26" },
//         { startDate: "Mar 29", endDate: "Apr 2" },
//         { startDate: "Apr 5", endDate: "Apr 9" },
//         { startDate: "Apr 12", endDate: "Apr 16" },
//         { startDate: "Apr 19", endDate: "Apr 23" },
//         { startDate: "Apr 26", endDate: "Apr 30" },
//         { startDate: "May 3", endDate: "May 7" },
//       ],
//     },
//     "schedule-spring-2027",
//   ),
// ];

// export const initialParticipants: Participant[] = [
//   { id: "p1", playerName: "Emma Johnson", age: 9, session: "AM", weekId: "Week 1", playerNumber: "525235235", tshirtSize: "YM", parentName: "Lisa Johnson", parentEmail: "lisa@gmail.com" },
//   { id: "p2", playerName: "Liam Chen", age: 12, session: "PM", weekId: "Week 1", playerNumber: "525235235", tshirtSize: "YL", parentName: "Wei Chen", parentEmail: "wei@gmail.com" },
//   { id: "p3", playerName: "Sophia Martinez", age: 10, session: "AM", weekId: "Week 1", playerNumber: "525235235", tshirtSize: "YL", parentName: "Carlos Martinez", parentEmail: "carlos@gmail.com" },
//   { id: "p4", playerName: "Noah Williams", age: 13, session: "PM", weekId: "Week 1", playerNumber: "525235235", tshirtSize: "M", parentName: "Sarah Williams", parentEmail: "sarah@gmail.com" },
//   { id: "p5", playerName: "Olivia Davis", age: 8, session: "AM", weekId: "Week 1", playerNumber: "525235235", tshirtSize: "YS", parentName: "Michael Davis", parentEmail: "michael@gmail.com" },
//   { id: "p6", playerName: "Ethan Brown", age: 14, session: "PM", weekId: "Week 1", playerNumber: "525235235", tshirtSize: "L", parentName: "Jennifer Brown", parentEmail: "jennifer@gmail.com" },
//   { id: "p7", playerName: "Ava Wilson", age: 10, session: "PM", weekId: "Week 1", playerNumber: "525235235", tshirtSize: "YL", parentName: "Robert Wilson", parentEmail: "robert@gmail.com" },
//   { id: "p8", playerName: "Mason Taylor", age: 11, session: "PM", weekId: "Week 1", playerNumber: "525235235", tshirtSize: "M", parentName: "Amanda Taylor", parentEmail: "amanda@gmail.com" },
// ];
