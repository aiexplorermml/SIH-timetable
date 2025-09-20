import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { studentData } from "../../data/students";

export function StudentDistributionChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Student Distribution by Department</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="department" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="firstYear" fill="#8884d8" name="1st Year" />
              <Bar dataKey="secondYear" fill="#82ca9d" name="2nd Year" />
              <Bar dataKey="thirdYear" fill="#ffc658" name="3rd Year" />
              <Bar dataKey="fourthYear" fill="#ff7300" name="4th Year" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}