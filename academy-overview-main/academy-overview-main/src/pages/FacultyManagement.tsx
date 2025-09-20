import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { UserPlus, Mail, Phone, Building, Eye, Edit, X, Check, AlertTriangle, MessageSquare, Search, Info } from "lucide-react";
import { departments } from "../../data/departments";

interface FacultyInvitation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  status: "Pending" | "Registered" | "Approved" | "Rejected" | "Require Changes";
  invitedDate: string;
}

const mockInvitations: FacultyInvitation[] = [
  {
    "id": "1",
    "firstName": "Aarav",
    "lastName": "Sharma",
    "email": "aarav.sharma@example.in",
    "phone": "+91 9000000001",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Pending",
    "invitedDate": "2025-08-01"
  },
  {
    "id": "2",
    "firstName": "Neha",
    "lastName": "Patel",
    "email": "neha.patel@example.in",
    "phone": "+91 9000000002",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Pending",
    "invitedDate": "2025-08-05"
  },
  {
    "id": "3",
    "firstName": "Ravi",
    "lastName": "Kumar",
    "email": "ravi.kumar@example.in",
    "phone": "+91 9000000003",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-07-22"
  },
  {
    "id": "4",
    "firstName": "Divya",
    "lastName": "Singh",
    "email": "divya.singh@example.in",
    "phone": "+91 9000000004",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-07-25"
  },
  {
    "id": "5",
    "firstName": "Siddharth",
    "lastName": "Gupta",
    "email": "siddharth.gupta@example.in",
    "phone": "+91 9000000005",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-07-28"
  },
  {
    "id": "6",
    "firstName": "Megha",
    "lastName": "Iyer",
    "email": "megha.iyer@example.in",
    "phone": "+91 9000000006",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-07-29"
  },
  {
    "id": "7",
    "firstName": "Pranav",
    "lastName": "Nair",
    "email": "pranav.nair@example.in",
    "phone": "+91 9000000007",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-07-30"
  },
  {
    "id": "8",
    "firstName": "Anita",
    "lastName": "Joshi",
    "email": "anita.joshi@example.in",
    "phone": "+91 9000000008",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-07-31"
  },
  {
    "id": "9",
    "firstName": "Karan",
    "lastName": "Malhotra",
    "email": "karan.malhotra@example.in",
    "phone": "+91 9000000009",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-02"
  },
  {
    "id": "10",
    "firstName": "Sunita",
    "lastName": "Chowdhury",
    "email": "sunita.chowdhury@example.in",
    "phone": "+91 9000000010",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-03"
  },
  {
    "id": "11",
    "firstName": "Vikram",
    "lastName": "Reddy",
    "email": "vikram.reddy@example.in",
    "phone": "+91 9000000011",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-04"
  },
  {
    "id": "12",
    "firstName": "Pooja",
    "lastName": "Saxena",
    "email": "pooja.saxena@example.in",
    "phone": "+91 9000000012",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-06"
  },
  {
    "id": "13",
    "firstName": "Ajay",
    "lastName": "Khatri",
    "email": "ajay.khatri@example.in",
    "phone": "+91 9000000013",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-07"
  },
  {
    "id": "14",
    "firstName": "Ritika",
    "lastName": "Kapoor",
    "email": "ritika.kapoor@example.in",
    "phone": "+91 9000000014",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-08"
  },
  {
    "id": "15",
    "firstName": "Manish",
    "lastName": "Bansal",
    "email": "manish.bansal@example.in",
    "phone": "+91 9000000015",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-09"
  },
  {
    "id": "16",
    "firstName": "Deepa",
    "lastName": "Trivedi",
    "email": "deepa.trivedi@example.in",
    "phone": "+91 9000000016",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-10"
  },
  {
    "id": "17",
    "firstName": "Raghav",
    "lastName": "Joshi",
    "email": "raghav.joshi@example.in",
    "phone": "+91 9000000017",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-11"
  },
  {
    "id": "18",
    "firstName": "Sonal",
    "lastName": "Gupta",
    "email": "sonal.gupta@example.in",
    "phone": "+91 9000000018",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-12"
  },
  {
    "id": "19",
    "firstName": "Tarun",
    "lastName": "Mehta",
    "email": "tarun.mehta@example.in",
    "phone": "+91 9000000019",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-13"
  },
  {
    "id": "20",
    "firstName": "Shweta",
    "lastName": "Choudhury",
    "email": "shweta.choudhury@example.in",
    "phone": "+91 9000000020",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Registered",
    "invitedDate": "2025-08-14"
  },
  {
    "id": "21",
    "firstName": "Naman",
    "lastName": "Verma",
    "email": "naman.verma@example.in",
    "phone": "+91 9000000021",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Require Changes",
    "invitedDate": "2025-07-20"
  },
  {
    "id": "22",
    "firstName": "Isha",
    "lastName": "Nair",
    "email": "isha.nair@example.in",
    "phone": "+91 9000000022",
    "department": "Artificial Intelligence & Machine Learning",
    "status": "Require Changes",
    "invitedDate": "2025-07-21"
  },
  {
    "id": "23",
    "firstName": "Rohit",
    "lastName": "Sharma",
    "email": "rohit.sharma@example.in",
    "phone": "+91 9000000023",
    "department": "Artificial Intelligence & Data Science",
    "status": "Pending",
    "invitedDate": "2025-08-01"
  },
  {
    "id": "24",
    "firstName": "Swati",
    "lastName": "Kulkarni",
    "email": "swati.kulkarni@example.in",
    "phone": "+91 9000000024",
    "department": "Artificial Intelligence & Data Science",
    "status": "Pending",
    "invitedDate": "2025-08-05"
  },
  {
    "id": "25",
    "firstName": "Suresh",
    "lastName": "Desai",
    "email": "suresh.desai@example.in",
    "phone": "+91 9000000025",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-07-22"
  },
  {
    "id": "26",
    "firstName": "Rekha",
    "lastName": "Iyer",
    "email": "rekha.iyer@example.in",
    "phone": "+91 9000000026",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-07-25"
  },
  {
    "id": "27",
    "firstName": "Sanjay",
    "lastName": "Acharya",
    "email": "sanjay.acharya@example.in",
    "phone": "+91 9000000027",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-07-28"
  },
  {
    "id": "28",
    "firstName": "Pallavi",
    "lastName": "Rao",
    "email": "pallavi.rao@example.in",
    "phone": "+91 9000000028",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-07-29"
  },
  {
    "id": "29",
    "firstName": "Arjun",
    "lastName": "Thakur",
    "email": "arjun.thakur@example.in",
    "phone": "+91 9000000029",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-07-30"
  },
  {
    "id": "30",
    "firstName": "Kajal",
    "lastName": "Chatterjee",
    "email": "kajal.chatterjee@example.in",
    "phone": "+91 9000000030",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-07-31"
  },
  {
    "id": "31",
    "firstName": "Mahesh",
    "lastName": "Vyas",
    "email": "mahesh.vyas@example.in",
    "phone": "+91 9000000031",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-08-02"
  },
  {
    "id": "32",
    "firstName": "Geeta",
    "lastName": "Nayak",
    "email": "geeta.nayak@example.in",
    "phone": "+91 9000000032",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-08-03"
  },
  {
    "id": "33",
    "firstName": "Vishal",
    "lastName": "Shah",
    "email": "vishal.shah@example.in",
    "phone": "+91 9000000033",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-08-04"
  },
  {
    "id": "34",
    "firstName": "Maya",
    "lastName": "Sen",
    "email": "maya.sen@example.in",
    "phone": "+91 9000000034",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-08-06"
  },
  {
    "id": "35",
    "firstName": "Nikhil",
    "lastName": "Chandra",
    "email": "nikhil.chandra@example.in",
    "phone": "+91 9000000035",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-08-07"
  },
  {
    "id": "36",
    "firstName": "Laxmi",
    "lastName": "Reddy",
    "email": "laxmi.reddy@example.in",
    "phone": "+91 9000000036",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-08-08"
  },
  {
    "id": "37",
    "firstName": "Suresh",
    "lastName": "Nambiar",
    "email": "suresh.nambiar@example.in",
    "phone": "+91 9000000037",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-08-09"
  },
  {
    "id": "38",
    "firstName": "Rupa",
    "lastName": "Devi",
    "email": "rupa.devi@example.in",
    "phone": "+91 9000000038",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-08-10"
  },
  {
    "id": "39",
    "firstName": "Anil",
    "lastName": "Sharma",
    "email": "anil.sharma@example.in",
    "phone": "+91 9000000039",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-08-11"
  },
  {
    "id": "40",
    "firstName": "Kiran",
    "lastName": "Das",
    "email": "kiran.das@example.in",
    "phone": "+91 9000000040",
    "department": "Artificial Intelligence & Data Science",
    "status": "Registered",
    "invitedDate": "2025-08-12"
  },
  {
    "id": "41",
    "firstName": "Rina",
    "lastName": "Mehta",
    "email": "rina.mehta@example.in",
    "phone": "+91 9000000041",
    "department": "Artificial Intelligence & Data Science",
    "status": "Require Changes",
    "invitedDate": "2025-07-20"
  },
  {
    "id": "42",
    "firstName": "Vinay",
    "lastName": "Joshi",
    "email": "vinay.joshi@example.in",
    "phone": "+91 9000000042",
    "department": "Artificial Intelligence & Data Science",
    "status": "Require Changes",
    "invitedDate": "2025-07-21"
  },
  {
    "id": "43",
    "firstName": "Rajesh",
    "lastName": "Kumar",
    "email": "rajesh.kumar@example.in",
    "phone": "+91 9000000043",
    "department": "Computer Science & Engineering",
    "status": "Pending",
    "invitedDate": "2025-08-01"
  },
  {
    "id": "44",
    "firstName": "Priya",
    "lastName": "Agarwal",
    "email": "priya.agarwal@example.in",
    "phone": "+91 9000000044",
    "department": "Computer Science & Engineering",
    "status": "Pending",
    "invitedDate": "2025-08-05"
  },
  {
    "id": "45",
    "firstName": "Sandeep",
    "lastName": "Rao",
    "email": "sandeep.rao@example.in",
    "phone": "+91 9000000045",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-07-22"
  },
  {
    "id": "46",
    "firstName": "Anjali",
    "lastName": "Nair",
    "email": "anjali.nair@example.in",
    "phone": "+91 9000000046",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-07-25"
  },
  {
    "id": "47",
    "firstName": "Manoj",
    "lastName": "Shah",
    "email": "manoj.shah@example.in",
    "phone": "+91 9000000047",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-07-28"
  },
  {
    "id": "48",
    "firstName": "Kavita",
    "lastName": "Reddy",
    "email": "kavita.reddy@example.in",
    "phone": "+91 9000000048",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-07-29"
  },
  {
    "id": "49",
    "firstName": "Nitin",
    "lastName": "Verma",
    "email": "nitin.verma@example.in",
    "phone": "+91 9000000049",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-07-30"
  },
  {
    "id": "50",
    "firstName": "Rachna",
    "lastName": "Joshi",
    "email": "rachna.joshi@example.in",
    "phone": "+91 9000000050",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-07-31"
  },
  {
    "id": "51",
    "firstName": "Amit",
    "lastName": "Gupta",
    "email": "amit.gupta@example.in",
    "phone": "+91 9000000051",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-08-02"
  },
  {
    "id": "52",
    "firstName": "Meera",
    "lastName": "Chatterjee",
    "email": "meera.chatterjee@example.in",
    "phone": "+91 9000000052",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-08-03"
  },
  {
    "id": "53",
    "firstName": "Rahul",
    "lastName": "Singh",
    "email": "rahul.singh@example.in",
    "phone": "+91 9000000053",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-08-04"
  },
  {
    "id": "54",
    "firstName": "Sonia",
    "lastName": "Kumar",
    "email": "sonia.kumar@example.in",
    "phone": "+91 9000000054",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-08-06"
  },
  {
    "id": "55",
    "firstName": "Karan",
    "lastName": "Bhatt",
    "email": "karan.bhatt@example.in",
    "phone": "+91 9000000055",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-08-07"
  },
  {
    "id": "56",
    "firstName": "Priyanka",
    "lastName": "Joshi",
    "email": "priyanka.joshi@example.in",
    "phone": "+91 9000000056",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-08-08"
  },
  {
    "id": "57",
    "firstName": "Vivek",
    "lastName": "Malhotra",
    "email": "vivek.malhotra@example.in",
    "phone": "+91 9000000057",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-08-09"
  },
  {
    "id": "58",
    "firstName": "Alka",
    "lastName": "Menon",
    "email": "alka.menon@example.in",
    "phone": "+91 9000000058",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-08-10"
  },
  {
    "id": "59",
    "firstName": "Vishal",
    "lastName": "Jain",
    "email": "vishal.jain@example.in",
    "phone": "+91 9000000059",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-08-11"
  },
  {
    "id": "60",
    "firstName": "Shruti",
    "lastName": "Singhal",
    "email": "shruti.singhal@example.in",
    "phone": "+91 9000000060",
    "department": "Computer Science & Engineering",
    "status": "Registered",
    "invitedDate": "2025-08-12"
  },
  {
    "id": "61",
    "firstName": "Arun",
    "lastName": "Deshpande",
    "email": "arun.deshpande@example.in",
    "phone": "+91 9000000061",
    "department": "Computer Science & Engineering",
    "status": "Require Changes",
    "invitedDate": "2025-07-20"
  },
  {
    "id": "62",
    "firstName": "Deepika",
    "lastName": "Rao",
    "email": "deepika.rao@example.in",
    "phone": "+91 9000000062",
    "department": "Computer Science & Engineering",
    "status": "Require Changes",
    "invitedDate": "2025-07-21"
  },
  {
    "id": "63",
    "firstName": "Raj",
    "lastName": "Verma",
    "email": "raj.verma@example.in",
    "phone": "+91 9000000063",
    "department": "Information Technology",
    "status": "Pending",
    "invitedDate": "2025-08-01"
  },
  {
    "id": "64",
    "firstName": "Lata",
    "lastName": "Sharma",
    "email": "lata.sharma@example.in",
    "phone": "+91 9000000064",
    "department": "Information Technology",
    "status": "Pending",
    "invitedDate": "2025-08-05"
  },
  {
    "id": "65",
    "firstName": "Harish",
    "lastName": "Patel",
    "email": "harish.patel@example.in",
    "phone": "+91 9000000065",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-07-22"
  },
  {
    "id": "66",
    "firstName": "Kiran",
    "lastName": "Singh",
    "email": "kiran.singh@example.in",
    "phone": "+91 9000000066",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-07-25"
  },
  {
    "id": "67",
    "firstName": "Nisha",
    "lastName": "Kumar",
    "email": "nisha.kumar@example.in",
    "phone": "+91 9000000067",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-07-28"
  },
  {
    "id": "68",
    "firstName": "Vijay",
    "lastName": "Joshi",
    "email": "vijay.joshi@example.in",
    "phone": "+91 9000000068",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-07-29"
  },
  {
    "id": "69",
    "firstName": "Divya",
    "lastName": "Gupta",
    "email": "divya.gupta@example.in",
    "phone": "+91 9000000069",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-07-30"
  },
  {
    "id": "70",
    "firstName": "Ajay",
    "lastName": "Nair",
    "email": "ajay.nair@example.in",
    "phone": "+91 9000000070",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-07-31"
  },
  {
    "id": "71",
    "firstName": "Shalini",
    "lastName": "Desai",
    "email": "shalini.desai@example.in",
    "phone": "+91 9000000071",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-08-02"
  },
  {
    "id": "72",
    "firstName": "Rakesh",
    "lastName": "Chatterjee",
    "email": "rakesh.chatterjee@example.in",
    "phone": "+91 9000000072",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-08-03"
  },
  {
    "id": "73",
    "firstName": "Anita",
    "lastName": "Sen",
    "email": "anita.sen@example.in",
    "phone": "+91 9000000073",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-08-04"
  },
  {
    "id": "74",
    "firstName": "Deepak",
    "lastName": "Malhotra",
    "email": "deepak.malhotra@example.in",
    "phone": "+91 9000000074",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-08-06"
  },
  {
    "id": "75",
    "firstName": "Neelam",
    "lastName": "Mehta",
    "email": "neelam.mehta@example.in",
    "phone": "+91 9000000075",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-08-07"
  },
  {
    "id": "76",
    "firstName": "Sanjay",
    "lastName": "Kaur",
    "email": "sanjay.kaur@example.in",
    "phone": "+91 9000000076",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-08-08"
  },
  {
    "id": "77",
    "firstName": "Sunita",
    "lastName": "Bhatt",
    "email": "sunita.bhatt@example.in",
    "phone": "+91 9000000077",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-08-09"
  },
  {
    "id": "78",
    "firstName": "Rohit",
    "lastName": "Jain",
    "email": "rohit.jain@example.in",
    "phone": "+91 9000000078",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-08-10"
  },
  {
    "id": "79",
    "firstName": "Nandini",
    "lastName": "Singh",
    "email": "nandini.singh@example.in",
    "phone": "+91 9000000079",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-08-11"
  },
  {
    "id": "80",
    "firstName": "Arvind",
    "lastName": "Verma",
    "email": "arvind.verma@example.in",
    "phone": "+91 9000000080",
    "department": "Information Technology",
    "status": "Registered",
    "invitedDate": "2025-08-12"
  },
  {
    "id": "81",
    "firstName": "Vaishali",
    "lastName": "Shah",
    "email": "vaishali.shah@example.in",
    "phone": "+91 9000000081",
    "department": "Information Technology",
    "status": "Require Changes",
    "invitedDate": "2025-07-20"
  },
  {
    "id": "82",
    "firstName": "Ramesh",
    "lastName": "Pillai",
    "email": "ramesh.pillai@example.in",
    "phone": "+91 9000000082",
    "department": "Information Technology",
    "status": "Require Changes",
    "invitedDate": "2025-07-21"
  }
];


export function FacultyManagement() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<FacultyInvitation[]>(mockInvitations);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: ""
  });

  // Get current user info from localStorage (in real app, use proper auth context)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserRole = currentUser.userType || '';
  const currentUserEmail = currentUser.email || '';

  // Helper functions to check permissions
  const canManageAll = () => ['admin', 'hod'].includes(currentUserRole);
  const canEditOwn = (invitationEmail: string) => currentUserEmail === invitationEmail;
  const isAdminOrHod = () => ['admin', 'hod'].includes(currentUserRole);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendInvitation = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.department) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newInvitation: FacultyInvitation = {
      id: (invitations.length + 1).toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      status: "Pending",
      invitedDate: new Date().toISOString().split('T')[0]
    };

    setInvitations(prev => [...prev, newInvitation]);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", department: "" });
    setIsInviteOpen(false);
    toast({
      title: "Success",
      description: "Faculty invitation sent successfully!",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "Pending": "outline",
      "Registered": "secondary",
      "Approved": "default",
      "Rejected": "destructive"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const handleViewDetails = (invitation: FacultyInvitation) => {
    navigate(`/admin/faculty-management/${invitation.id}`);
  };

  const handleEdit = (invitation: FacultyInvitation) => {
    navigate(`/admin/faculty-management/${invitation.id}/edit`);
  };

  const handleCancel = (invitation: FacultyInvitation) => {
    toast({
      title: "Invitation Cancelled",
      description: `Cancelled invitation for ${invitation.firstName} ${invitation.lastName}`,
      variant: "destructive"
    });
  };

  const handleApprove = (invitation: FacultyInvitation) => {
    toast({
      title: "Faculty Approved",
      description: `Approved ${invitation.firstName} ${invitation.lastName}`,
    });
  };

  const handleDeny = (invitation: FacultyInvitation) => {
    toast({
      title: "Faculty Denied",
      description: `Denied ${invitation.firstName} ${invitation.lastName}`,
      variant: "destructive"
    });
  };

  const handleRequestModifications = (invitation: FacultyInvitation) => {
    toast({
      title: "Modifications Requested",
      description: `Requested modifications from ${invitation.firstName} ${invitation.lastName}`,
    });
  };

  const filteredInvitations = useMemo(() => {
    return invitations.filter((invitation) => {
      const fullName = `${invitation.firstName} ${invitation.lastName}`.toLowerCase();
      const matchesSearch = searchTerm === "" || 
        fullName.includes(searchTerm.toLowerCase()) ||
        invitation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invitation.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || invitation.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || invitation.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [invitations, searchTerm, statusFilter, departmentFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDepartmentFilter("all");
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || departmentFilter !== "all";

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 animate-fade-in">
        {/* Demo Banner */}
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Demo Environment:</strong> This is a demonstration interface with sample data. 
            Faculty information displayed here is for testing purposes only and will not synchronize 
            with the actual department faculty database.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Faculty Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage faculty invitations and registrations
            </p>
          </div>

          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="hover-scale">
                <UserPlus className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Send Faculty Invitation</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new faculty member with mandatory details.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="faculty@college.edu"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 9876543210"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Select department" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendInvitation}>
                    Send Invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Faculty Invitations</CardTitle>
            <CardDescription>
              Track and manage faculty invitation status and registrations
            </CardDescription>
            
            {/* Search and Filters */}
            <div className="space-y-4 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Registered">Registered</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {hasActiveFilters ? "No faculty found matching your filters." : "No faculty invitations found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvitations.map((invitation) => (
                  <TableRow key={invitation.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {invitation.firstName} {invitation.lastName}
                    </TableCell>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell>{invitation.phone}</TableCell>
                    <TableCell>{invitation.department}</TableCell>
                    <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                    <TableCell>{invitation.invitedDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {/* View button - visible to all users who can access the page (admin, hod) */}
                        {canManageAll() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(invitation)}
                            className="hover-scale"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {/* Edit button - only for the faculty user's own details */}
                        {canEditOwn(invitation.email) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(invitation)}
                            className="hover-scale"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {/* Cancel button - only for the faculty user's own details */}
                        {canEditOwn(invitation.email) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(invitation)}
                            className="hover-scale text-destructive"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {/* Administrative actions - only for admin and hod */}
                        {isAdminOrHod() && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(invitation)}
                              className="hover-scale text-green-600"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeny(invitation)}
                              className="hover-scale text-destructive"
                              title="Deny"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRequestModifications(invitation)}
                              className="hover-scale text-orange-600"
                              title="Request Modifications"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}