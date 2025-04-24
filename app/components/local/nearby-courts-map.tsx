// components/local/nearby-courts-map.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MapPin, Clock } from "lucide-react" // Using Clock instead of Timer

// Define the court data structure
interface CourtInfo {
  id: string; // Use address or a unique identifier if available from your DB
  name: string;
  address: string;
  driveTime: number | null; // Drive time in minutes, null if not found
}

// --- Court Data with Calculated Drive Times ---
// (Based on the 40 unique locations calculated previously)
const courtData: CourtInfo[] = [
  // Note: Added an 'id' based on address for React keys. Replace if you have actual DB IDs.
  // Times based on previous calculations from 2116 4th Ave W, Seattle, WA 98119
  { id: "glp7201", name: "Green Lake Park", address: "7201 E Green Lake DR N Seattle, WA, 98115", driveTime: 13 },
  { id: "aytc2000", name: "Amy Yee Tennis Center (AYTC)", address: "2000 Martin Luther King Jr. WAY S Seattle, WA, 98144", driveTime: 17 },
  { id: "lw5773", name: "Lower Woodland Playfield", address: "5773 WEST GREEN LAKE WAY N SEATTLE, WA, 98103", driveTime: 9 },
  { id: "vp1247", name: "Volunteer Park", address: "1247 15th AVE E Seattle, WA, 98112", driveTime: 17 },
  { id: "lw1000", name: "Lower Woodland Playfield", address: "1000 N 50TH ST SEATTLE, WA, 98103", driveTime: 7 },
  { id: "sp5898", name: "Seward Park", address: "5898 Lake Washington BLVD S Seattle, WA, 98118", driveTime: 26 },
  { id: "jp3901", name: "Jefferson Park (previously Lid Playfield)", address: "3901 Beacon AVE S Seattle, WA, 98108", driveTime: 16 },
  { id: "oc1405", name: "Observatory Courts", address: "1405 Warren AVE N Seattle, WA, 98109", driveTime: 5 },
  { id: "ap5817", name: "Alki Playfield", address: "5817 SW Lander ST Seattle, WA, 98136", driveTime: 18 },
  { id: "blp13035", name: "Bitter Lake Playfield", address: "13035 Linden AVE N Seattle, WA, 98133", driveTime: 19 },
  { id: "bhp1902", name: "Beacon Hill Playfield", address: "1902 13th AVE S Seattle, WA, 98144", driveTime: 16 },
  { id: "bp6000", name: "Brighton Playfield", address: "6000 39th AVE S Seattle, WA, 98136", driveTime: 23 },
  { id: "bry4103", name: "Bryant Playground", address: "4103 NE 65th ST Seattle, WA, 98115", driveTime: 19 },
  { id: "drp2800", name: "David Rodgers Park", address: "2800 1st AVE W Seattle, WA, 98119", driveTime: 3 },
  { id: "dp2919", name: "Dearborn Park", address: "2919 S Brandon ST Seattle, WA, 98126", driveTime: 20 },
  { id: "delp4458", name: "Delridge Playfield", address: "4458 Delridge WAY SW Seattle, WA, 98106", driveTime: 13 },
  { id: "disp3801", name: "Discovery Park", address: "3801 Discovery Park BLVD Seattle, WA, 98199", driveTime: 15 },
  { id: "fp7200", name: "Froula Playground", address: "7200 12th AVE NE Seattle, WA, 98115", driveTime: 15 },
  { id: "gp2323", name: "Garfield Playfield", address: "2323 E Cherry ST Seattle, WA, 98122", driveTime: 20 },
  { id: "gilp923", name: "Gilman Playfield", address: "923 NW 54th ST Seattle, WA, 98107", driveTime: 10 },
  { id: "hp2700", name: "Hiawatha Playfield", address: "2700 SW California AVE SW Seattle, WA, 98116", driveTime: 15 },
  { id: "lp4544", name: "Laurelhurst Playfield", address: "4544 NE 41st ST Seattle, WA, 98105", driveTime: 21 },
  { id: "mpMadison", name: "Madison Park", address: "E Madison St & E Howe ST Seattle, WA, 98112", driveTime: 22 },
  { id: "magp1461", name: "Magnolia Park", address: "1461 Magnolia BLVD W Seattle, WA, 98199", driveTime: 10 },
  { id: "magpl2518", name: "Magnolia Playfield", address: "2518 W 34th W Seattle, WA, 98199", driveTime: 11 },
  { id: "mbp10533", name: "Meadowbrook Playfield", address: "10533 35th AVE NE Seattle, WA, 98125", driveTime: 20 },
  { id: "mbp10559", name: "Meadowbrook Playfield", address: "10559 RAVENNA AVE NE SEATTLE, WA, 98125", driveTime: 20 }, // Note: API resolved to same time as above
  { id: "millp300", name: "Miller Playfield", address: "300 19th AVE E Seattle, WA, 98112", driveTime: 18 },
  { id: "montp1618", name: "Montlake Playfield", address: "1618 E Calhoun ST Seattle, WA, 98112", driveTime: 15 },
  { id: "mtbp2521", name: "Mount Baker Park", address: "2521 Lake Park DR S Seattle, WA, 98144", driveTime: 20 },
  { id: "rbp8802", name: "Rainier Beach Playfield", address: "8802 Rainier AVE S Seattle, WA, 98118", driveTime: 24 },
  { id: "rp3700", name: "Rainier Playfield", address: "3700 S Alaska ST Seattle, WA, 98118", driveTime: 21 },
  { id: "rivp7226", name: "Riverview Playfield", address: "7226 12th AVE SW Seattle, WA, 98106", driveTime: 19 },
  { id: "rogpEastlake", name: "Rogers (Eastlake) Playfield", address: "Eastlake AVE E & E Roanoke ST Seattle, WA, 98112", driveTime: 14 },
  { id: "ssp1400", name: "Sam Smith Park (I-90 Lid)", address: "1400 Martin Luther King Jr WAY S Seattle, WA, 98144", driveTime: 17 },
  { id: "solp7400", name: "Solstice Park", address: "7400 Fauntleroy WAY SW Seattle, WA, 98136", driveTime: 20 },
  { id: "soundp1590", name: "Soundview Playfield (Athletics)", address: "1590 NW 90th ST Seattle, WA, 98117", driveTime: 15 },
  { id: "wallp4219", name: "Wallingford Playfield (Athletics)", address: "4219 Wallingford AVE N Seattle, WA, 98103", driveTime: 8 },
  { id: "whp6920", name: "Walt Hundley Playfield", address: "6920 34th AVE SW Seattle, WA, 98126", driveTime: 19 },
  { id: "madplay3211", name: "Madrona Playground", address: "3211 E Spring ST Seattle, WA, 98122", driveTime: 23 },
];
// --- End Court Data ---

export function NearbyCourtsMapWidget() {
  const originAddress = "2116 4th Avenue W, Seattle, WA, 98119";

  // Filter courts into time brackets
  const courts5min = courtData.filter(c => c.driveTime !== null && c.driveTime <= 5).sort((a, b) => (a.driveTime ?? Infinity) - (b.driveTime ?? Infinity));
  const courts6to10min = courtData.filter(c => c.driveTime !== null && c.driveTime > 5 && c.driveTime <= 10).sort((a, b) => (a.driveTime ?? Infinity) - (b.driveTime ?? Infinity));
  const courts11to15min = courtData.filter(c => c.driveTime !== null && c.driveTime > 10 && c.driveTime <= 15).sort((a, b) => (a.driveTime ?? Infinity) - (b.driveTime ?? Infinity));
  const courts16to20min = courtData.filter(c => c.driveTime !== null && c.driveTime > 15 && c.driveTime <= 20).sort((a, b) => (a.driveTime ?? Infinity) - (b.driveTime ?? Infinity));
  const courtsOver20min = courtData.filter(c => c.driveTime !== null && c.driveTime > 20).sort((a, b) => (a.driveTime ?? Infinity) - (b.driveTime ?? Infinity));

  // Helper to render a list of courts for an accordion item
  const renderCourtList = (courts: CourtInfo[]) => (
    <ul className="space-y-3 pl-2">
      {courts.map(court => (
        <li key={court.id} className="flex items-start gap-3 text-sm">
          <MapPin className="h-4 w-4 mt-0.5 text-gray-500 shrink-0" />
          <div className="flex-1">
            <span className="font-medium">{court.name || 'Court Location'}</span>
            <span className="block text-xs text-gray-500">{court.address}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
            <Clock className="h-3 w-3" />
            ~{court.driveTime} min
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto"> {/* Adjust max-width as needed */}
      <CardHeader>
        <CardTitle>Nearby Courts by Drive Time</CardTitle>
        <CardDescription>
          Approximate driving times from {originAddress}. Times may vary with traffic.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1">
          {/* 0-5 Minutes */}
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base font-semibold">
              Within 5 Minutes ({courts5min.length} courts)
            </AccordionTrigger>
            <AccordionContent>
              {courts5min.length > 0 ? renderCourtList(courts5min) : <p className="text-sm text-gray-500 pl-2">No courts found in this range.</p>}
            </AccordionContent>
          </AccordionItem>

          {/* 6-10 Minutes */}
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base font-semibold">
              6 - 10 Minutes ({courts6to10min.length} courts)
            </AccordionTrigger>
            <AccordionContent>
              {courts6to10min.length > 0 ? renderCourtList(courts6to10min) : <p className="text-sm text-gray-500 pl-2">No courts found in this range.</p>}
            </AccordionContent>
          </AccordionItem>

          {/* 11-15 Minutes */}
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base font-semibold">
              11 - 15 Minutes ({courts11to15min.length} courts)
            </AccordionTrigger>
            <AccordionContent>
              {courts11to15min.length > 0 ? renderCourtList(courts11to15min) : <p className="text-sm text-gray-500 pl-2">No courts found in this range.</p>}
            </AccordionContent>
          </AccordionItem>

          {/* 16-20 Minutes */}
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-base font-semibold">
              16 - 20 Minutes ({courts16to20min.length} courts)
            </AccordionTrigger>
            <AccordionContent>
              {courts16to20min.length > 0 ? renderCourtList(courts16to20min) : <p className="text-sm text-gray-500 pl-2">No courts found in this range.</p>}
            </AccordionContent>
          </AccordionItem>

          {/* Over 20 Minutes */}
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-base font-semibold">
              Over 20 Minutes ({courtsOver20min.length} courts)
            </AccordionTrigger>
            <AccordionContent>
              {courtsOver20min.length > 0 ? renderCourtList(courtsOver20min) : <p className="text-sm text-gray-500 pl-2">No courts found in this range.</p>}
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}