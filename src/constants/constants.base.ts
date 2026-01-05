
import { User, UserRole, JobPost, JobStatus, AvailabilityStatus, JobGenderType, Gender } from '../types';

export type Language = 'en' | 'ms';

export interface ReportSection {
  id: number | string;
  title: string;
  content: string[] | string;
  contentMy?: string[] | string;
  titleMy?: string;
  diagramNote?: string;
  diagramNoteMy?: string;
}

export interface UmlDiagram {
  id: number;
  title: string;
  titleMy?: string;
  type: 'use-case' | 'class' | 'sequence' | 'activity' | 'deployment' | 'component';
  description: string;
  descriptionMy?: string;
  plantUmlCode: string;
  svgUrl?: string;
}

export interface ReportChapter {
  id: number;
  title: string;
  titleMy?: string;
  icon: string;
  description: string;
  descriptionMy?: string;
  sections: ReportSection[];
  umlDiagrams?: UmlDiagram[];
}

export const ACADEMIC_REPORT: ReportChapter[] = [
  {
    id: 1,
    title: "Chapter 1: Introduction",
    titleMy: "Bab 1: Pengenalan",
    icon: "🎓",
    description: "Overview of the UniSZA e-Job initiative.",
    descriptionMy: "Gambaran keseluruhan inisiatif UniSZA e-Job.",
    sections: [
      {
        id: 1,
        title: "1.1 Project Background",
        titleMy: "1.1 Latar Belakang Projek",
        content: ["UniSZA e-Job is a localized recruitment platform designed to bridge the gap between campus employers and students seeking part-time income. It centralizes vacancies and student availability into a single, real-time ecosystem."],
        contentMy: ["UniSZA e-Job adalah platform pengambilan pekerja setempat yang direka untuk merapatkan jurang antara majikan kampus dan pelajar yang mencari pendapatan sambilan. Ia memusatkan kekosongan kerja dan ketersediaan pelajar ke dalam satu ekosistem masa-nyata."]
      },
      {
        id: 2,
        title: "1.2 Problem Statement",
        titleMy: "1.2 Pernyataan Masalah",
        content: [
          "• Fragmented Communication: Job offers are often scattered across unofficial Telegram and WhatsApp groups.",
          "• Schedule Conflicts: Employers lack visibility into student lecture schedules, leading to hiring mismatches.",
          "• Profile Management: No professional way for students to showcase their skills and past campus work experience."
        ],
        contentMy: [
          "• Komunikasi Berpecah: Tawaran kerja sering bersepah di kumpulan Telegram dan WhatsApp yang tidak rasmi.",
          "• Konflik Jadual: Majikan kurang jelas mengenai jadual kuliah pelajar, membawa kepada padanan kerja yang salah.",
          "• Pengurusan Profil: Tiada cara profesional untuk pelajar menunjukkan kemahiran dan pengalaman kerja kampus mereka."
        ]
      },
      {
        id: 3,
        title: "1.3 Project Objectives",
        titleMy: "1.3 Objektif Projek",
        content: [
          "1. To centralize all campus-based part-time job opportunities for UniSZA students.",
          "2. To provide a smart calendar system for students to broadcast their available slots.",
          "3. To simplify the application and shortlisting process for university departments."
        ],
        contentMy: [
          "1. Memusatkan semua peluang kerja sambilan berasaskan kampus untuk pelajar UniSZA.",
          "2. Menyediakan sistem kalendar pintar untuk pelajar menyiarkan slot masa lapang mereka.",
          "3. Memudahkan proses permohonan dan senarai pendek bagi jabatan-jabatan universiti."
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Chapter 2: System Analysis",
    titleMy: "Bab 2: Analisis Sistem",
    icon: "📋",
    description: "Detailed analysis of user roles and requirements.",
    descriptionMy: "Analisis terperinci mengenai peranan pengguna dan keperluan.",
    sections: [
      {
        id: 1,
        title: "2.1 User Roles",
        titleMy: "2.1 Peranan Pengguna",
        content: [
          "• Job Seeker (Student): Browses jobs, manages profile, and updates hourly availability.",
          "• Employer (Staff/Dept): Posts vacancies, reviews applicants, and initiates contact via WhatsApp.",
          "• Administrator: Manages system settings, audits logs, and performs database backups."
        ],
        contentMy: [
          "• Pencari Kerja (Pelajar): Mencari kerja, mengurus profil, dan mengemas kini ketersediaan setiap jam.",
          "• Majikan (Kakitangan/Jabatan): Menyiarkan kekosongan, menyemak pemohon, dan memulakan hubungan melalui WhatsApp.",
          "• Pentadbir: Mengurus tetapan sistem, mengaudit log, dan melakukan sandaran pangkalan data."
        ]
      },
      {
        id: 2,
        title: "2.2 Functional Requirements",
        titleMy: "2.2 Keperluan Fungsian",
        content: [
          "• User Authentication (Login/Register)",
          "• Interactive Availability Calendar",
          "• Real-time Job Search & Filtering",
          "• Application Pipeline Tracking",
          "• Multi-language Localization (EN/MS)"
        ],
        contentMy: [
          "• Pengesahan Pengguna (Log Masuk/Daftar)",
          "• Kalendar Ketersediaan Interaktif",
          "• Carian & Penapisan Kerja Masa-Nyata",
          "• Penjejakan Saluran Permohonan",
          "• Terjemahan Pelbagai Bahasa (EN/MS)"
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Chapter 3: System Design",
    titleMy: "Bab 3: Reka Bentuk Sistem",
    icon: "📐",
    description: "Architecture and UML visual design.",
    descriptionMy: "Seni bina dan reka bentuk visual UML.",
    sections: [
      {
        id: 1,
        title: "3.1 System Architecture",
        titleMy: "3.1 Seni Bina Sistem",
        content: ["The system uses a Single Page Application (SPA) architecture built with React. Data persistence is managed via LocalStorage to ensure speed and local availability without complex backend dependencies."],
        contentMy: ["Sistem ini menggunakan seni bina Single Page Application (SPA) yang dibina dengan React. Penyimpanan data diuruskan melalui LocalStorage untuk memastikan kelajuan dan ketersediaan setempat tanpa kebergantungan backend yang kompleks."]
      }
    ],
    umlDiagrams: [
      {
        id: 1,
        title: "Use Case Diagram",
        titleMy: "Rajah Use Case",
        type: "use-case",
        description: "Visualizes the primary interactions between stakeholders and the e-Job platform.",
        descriptionMy: "Memvisualisasikan interaksi utama antara pihak berkepentingan dan platform e-Job.",
        plantUmlCode: `@startuml
 left to right direction
 actor "Student" as S
 actor "Employer" as E
 actor "Admin" as A
 rectangle "UniSZA e-Job" {
   S -- (Update Availability)
   S -- (Apply Job)
   (Post Vacancy) -- E
   (Shortlist Seeker) -- E
   (Backup Database) -- A
 }
 @enduml`
      },
      {
        id: 2,
        title: "Sequence Diagram: Application Flow",
        titleMy: "Rajah Urutan: Aliran Permohonan",
        type: "sequence",
        description: "Illustrates the step-by-step logic when a student applies for a job.",
        descriptionMy: "Menggambarkan logik langkah-demi-langkah apabila pelajar memohon kerja.",
        plantUmlCode: `@startuml
 actor Student
 participant "Job Dashboard" as UI
 participant "App Engine" as Engine
 database "LocalStorage" as DB
 Student -> UI: Click 'Apply'
 UI -> Engine: createApplication(jobId, seekerId)
 Engine -> DB: saveApplication()
 DB --> Engine: Success
 Engine --> UI: Show 'Sent' Status
 @enduml`
      }
    ]
  },
  {
    id: 4,
    title: "Chapter 4: Implementation & Conclusion",
    titleMy: "Bab 4: Implementasi & Kesimpulan",
    icon: "📊",
    description: "Final conclusions and future roadmap.",
    descriptionMy: "Kesimpulan akhir dan pelan masa hadapan.",
    sections: [
      {
        id: 1,
        title: "4.1 Implementation Stack",
        titleMy: "4.1 Stack Implementasi",
        content: ["• React v19: For interactive UI components.", "• Tailwind CSS: For styling.", "• Pako: For data compression in export modules.", "• Gemini API: For design insights and feedback."],
        contentMy: ["• React v19: Untuk komponen UI interaktif.", "• Tailwind CSS: Untuk gayaan.", "• Pako: Untuk pemampatan data dalam modul eksport.", "• Gemini API: Untuk wawasan reka bentuk dan maklum balas."]
      },
      {
        id: 2,
        title: "4.2 Project Conclusion",
        titleMy: "4.2 Kesimpulan Projek",
        content: ["The UniSZA e-Job system successfully addresses the information gap in student employment, providing a modern, bilingual, and efficient tool for the campus community."],
        contentMy: ["Sistem UniSZA e-Job berjaya menangani jurang maklumat dalam pekerjaan pelajar, menyediakan alat yang moden, dwi-bahasa, dan cekap untuk komuniti kampus."]
      }
    ]
  }
];

export const CHAPTER_ICONS: Record<number, string> = {
  1: "☕",
  2: "📋",
  3: "📐",
  4: "📊"
};

export const APP_LOGO = "https://www.appsheet.com:443/fsimage.png?appid=5dc89ba5-061e-43fb-ad43-f3748b8dc472&datasource=google&filename=DocId%3D1NUyhmYoqeE19yIPjN8Fd73xn5WVwCtrJ&signature=7750b0b2dc07136464f1c83de1975101726b0b658fb8a24e3dc36f6f52f497f2&tableprovider=google&userid=319244941";
export const ADMIN_WHATSAPP = "+601158853520";

export const INITIAL_USERS: User[] = [
  {
    id: "owner-001",
    role: UserRole.OWNER,
    username: "ishxi",
    password: "owner",
    firstName: "Ishxi",
    lastName: "Lixe",
    phoneNumber: "601158853520",
    email: "luqmanlixe98@gmail.com",
    avatar: "https://ui-avatars.com/api/?name=System+Owner&background=6366f1&color=fff",
    profile: {
      bio: "System administrator for Cafe's Little Helper",
      averageRating: 5.0,
      totalRatings: 0,
      gender: Gender.MALE
    }
  },
  {
    id: "admin-001",
    role: UserRole.ADMIN,
    username: "ayuni",
    password: "admin",
    firstName: "Admin",
    lastName: "Ayuni",
    phoneNumber: "601137932736",
    email: "admin@unisza.edu.my",
    avatar: "https://ui-avatars.com/api/?name=Admin+1&background=8b5cf6&color=fff",
    profile: {
      bio: "System administrator",
      averageRating: 5.0,
      totalRatings: 0,
      gender: Gender.FEMALE
    }
  },
  {
    id: "emp-001",
    role: UserRole.EMPLOYER,
    username: "umi",
    password: "emp123",
    firstName: "Umi",
    lastName: "Fik",
    phoneNumber: "601119828055",
    email: "maarufent@gmail.com",
    avatar: "https://ui-avatars.com/api/?name=Umi+Fik&background=eab308&color=fff",
    employerProfile: {
      companyName: "Kantin Umi FIK",
      businessType: "Makanan & Minuman",
      bio: "Pemilik kantin dengan pengalaman lebih 10 tahun mengurus perkhidmatan makanan kampus. Menyediakan makanan dan minuman kepada pelajar dan kakitangan.",
      averageRating: 4.5,
      totalRatings: 12,
      location: "Kantin FIK"
    }
  },
  {
    id: "emp-002",
    role: UserRole.EMPLOYER,
    username: "senah",
    password: "emp123",
    firstName: "Senah",
    lastName: "Jusof",
    phoneNumber: "60123456790",
    email: "senahj@gmail.com",
    avatar: "https://ui-avatars.com/api/?name=Senah+Jusof&background=f472b6&color=fff",
    employerProfile: {
      companyName: "Cafe' Siswi - Minuman Senah",
      businessType: "Makanan & Minuman",
      bio: "Penjual minuman di Cafe' Siswi. Menghargai kejujuran, komitmen dan kebolehpercayaan. Proses pengambilan pekerja yang pantas dan mudah.",
      averageRating: 4.8,
      totalRatings: 8,
      location: "Cafe Siswi"
    }
  },
  {
    id: "emp-003",
    role: UserRole.EMPLOYER,
    username: "zainab",
    password: "emp123",
    firstName: "Zainab",
    lastName: "Hassan",
    phoneNumber: "601158853148",
    email: "zainabhassan@gmail.com",
    avatar: "https://ui-avatars.com/api/?name=Zainab+Hassan&background=fb923c&color=fff",
    employerProfile: {
      companyName: "Stall Zainab - Ayam Goreng",
      businessType: "Makanan & Minuman",
      bio: "Pemilik stall ayam goreng yang dikenali kerana personaliti mesra dan kesediaan melatih pelajar baharu. Waktu kerja fleksibel untuk pelajar.",
      averageRating: 4.2,
      totalRatings: 15,
      location: "Kantin Siswa"
    }
  },
  {
    id: "student-001",
    role: UserRole.JOB_SEEKER,
    username: "088336",
    password: "std123",
    firstName: "Ameena Syazwani",
    lastName: "Ahmad Khairi",
    phoneNumber: "60132921969",
    email: "088336@putra.unisza.edu.my",
    avatar: "https://ui-avatars.com/api/?name=Ameena+Syazwani&background=f472b6&color=fff",
    profile: {
      major: "Informatics Media",
      year: 1,
      skills: ["Customer Service", "Communication", "Teamwork"],
      experience: "Volunteer at campus event",
      bio: "Friendly and hardworking student looking for part-time work",
      status: AvailabilityStatus.AVAILABLE,
      averageRating: 4.5,
      totalRatings: 3,
      gender: Gender.FEMALE,
      hourlyAvailability: {
        "Monday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "MAYBE", "13:00": "MAYBE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Tuesday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "MAYBE", "13:00": "MAYBE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Wednesday": { "09:00": "BUSY", "10:00": "BUSY", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Thursday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "MAYBE", "13:00": "MAYBE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Friday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "BUSY", "15:00": "BUSY", "16:00": "AVAILABLE" }
      }
    }
  },
  {
    id: "student-002",
    role: UserRole.JOB_SEEKER,
    username: "086720",
    password: "std123",
    firstName: "Muhammad Adam Daniel",
    lastName: "Saiful Nazri",
    phoneNumber: "60135657115",
    email: "086720@putra.unisza.edu.my",
    avatar: "https://ui-avatars.com/api/?name=Adam+Daniel&background=60a5fa&color=fff",
    profile: {
      major: "Informatics Media",
      year: 1,
      skills: ["Time Management", "Food Handling", "Communication"],
      experience: "Part-time at family restaurant",
      bio: "Responsible and punctual student seeking work experience",
      status: AvailabilityStatus.AVAILABLE,
      averageRating: 4.0,
      totalRatings: 2,
      gender: Gender.MALE,
      hourlyAvailability: {
        "Monday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "MAYBE", "12:00": "MAYBE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Tuesday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "MAYBE", "14:00": "MAYBE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Wednesday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Thursday": { "09:00": "BUSY", "10:00": "BUSY", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Friday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "MAYBE", "12:00": "MAYBE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" }
      }
    }
  },
  {
    id: "student-003",
    role: UserRole.JOB_SEEKER,
    username: "ubai",
    password: "std123",
    firstName: "Muhammad Aidid Danial",
    lastName: "Zulkiflee",
    phoneNumber: "60135142840",
    email: "086446@putra.unisza.edu.my",
    avatar: "https://ui-avatars.com/api/?name=Aidid+Danial&background=f472b6&color=fff",
    profile: {
      major: "Informatics Media",
      year: 1,
      skills: ["Cashier", "Customer Service", "Microsoft Office"],
      experience: "Cashier at school carnival",
      bio: "Organized and detail-oriented student looking for part-time opportunities",
      status: AvailabilityStatus.AVAILABLE,
      averageRating: 4.8,
      totalRatings: 5,
      gender: Gender.MALE,
      hourlyAvailability: {
        "Monday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "MAYBE", "15:00": "MAYBE", "16:00": "AVAILABLE" },
        "Tuesday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Wednesday": { "09:00": "MAYBE", "10:00": "MAYBE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Thursday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Friday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" }
      }
    }
  },
  {
    id: "student-004",
    role: UserRole.JOB_SEEKER,
    username: "rusydan",
    password: "std123",
    firstName: "Muhammad Aiman Rusydan",
    lastName: "Mokhtar",
    phoneNumber: "60139653256",
    email: "087024@putra.unisza.edu.my",
    avatar: "https://ui-avatars.com/api/?name=Aiman+Rusydan&background=60a5fa&color=fff",
    profile: {
      major: "Informatics Media",
      year: 1,
      skills: ["Food Preparation", "Cleaning", "Teamwork"],
      experience: "Helped at family food stall during holidays",
      bio: "Hardworking student looking for flexible part-time work",
      status: AvailabilityStatus.AVAILABLE,
      averageRating: 3.5,
      totalRatings: 1,
      gender: Gender.MALE,
      hourlyAvailability: {
        "Monday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "MAYBE", "12:00": "MAYBE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Tuesday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "MAYBE", "14:00": "MAYBE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Wednesday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Thursday": { "09:00": "BUSY", "10:00": "BUSY", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Friday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "BUSY", "15:00": "BUSY", "16:00": "AVAILABLE" }
      }
    }
  },
  {
    id: "student-005",
    role: UserRole.JOB_SEEKER,
    username: "fitrena",
    password: "std123",
    firstName: "Nur Najwa Fitrena",
    lastName: "Mohd Rawi",
    phoneNumber: "60193380326",
    email: "086401@putra.unisza.edu.my",
    avatar: "https://ui-avatars.com/api/?name=Najwa+Fitrena&background=f472b6&color=fff",
    profile: {
      major: "Informatics Media",
      year: 1,
      skills: ["Social Media", "Communication", "Customer Service"],
      experience: "Social media admin for school club",
      bio: "Energetic and friendly student seeking work experience in F&B",
      status: AvailabilityStatus.AVAILABLE,
      averageRating: 5.0,
      totalRatings: 4,
      gender: Gender.FEMALE,
      hourlyAvailability: {
        "Monday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "MAYBE", "13:00": "MAYBE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Tuesday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "MAYBE", "13:00": "MAYBE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Wednesday": { "09:00": "BUSY", "10:00": "BUSY", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Thursday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" },
        "Friday": { "09:00": "AVAILABLE", "10:00": "AVAILABLE", "11:00": "AVAILABLE", "12:00": "AVAILABLE", "13:00": "AVAILABLE", "14:00": "AVAILABLE", "15:00": "AVAILABLE", "16:00": "AVAILABLE" }
      }
    }
  }
];

export const INITIAL_JOBS: JobPost[] = [
  {
    id: "job-0001",
    employerId: "emp-001",
    employerName: "Kantin Umi FIK",
    title: "Pembantu Cafeteria (Pagi)",
    description: "Membantu menyediakan sarapan dan mengemas meja kantin. Tugas termasuk menyusun makanan, membersihkan kawasan dan membantu pelanggan.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM8.00/sejam",
    contactWhatsapp: "601119828055",
    preferredGender: JobGenderType.OPEN,
    location: "Kantin FIK",
    schedule: "Ahand - Khamis, 7:00 AM - 11:00 AM",
    requirements: ["Mesra pelanggan", "Boleh bekerja awal pagi", "Kerja berpasukan"]
  },
  {
    id: "job-0002",
    employerId: "emp-001",
    employerName: "Kantin Umi FIK",
    title: "Pembantu Cafeteria (Petang)",
    description: "Membantu waktu puncak petang ketika waktu lunch. Tugas termasuk mengemas meja, mencuci pinggan dan membantu operasi harian.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM8.00/sejam",
    contactWhatsapp: "601119828055",
    preferredGender: JobGenderType.OPEN,
    location: "Kantin FIK",
    schedule: "Ahand - Khamis, 12:00 PM - 3:00 PM",
    requirements: ["Mesra pelanggan", "Boleh bekerja waktu lunch", "Kerja berpasukan"]
  },
  {
    id: "job-0003",
    employerId: "emp-001",
    employerName: "Kantin Umi FIK",
    title: "Pembantu Gantian (Last Minute)",
    description: "Keperluan untuk menggantikan staff yang sakit atau cuti. Fleksibel dan boleh dihubungi bila-bila masa.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM8.00/sejam",
    contactWhatsapp: "601119828055",
    preferredGender: JobGenderType.OPEN,
    location: "Kantin FIK",
    schedule: "Mengikut keperluan",
    requirements: ["Fleksibel", "Boleh dihubungi", "Kerja berpasukan"]
  },
  {
    id: "job-0004",
    employerId: "emp-002",
    employerName: "Cafe Siswi - Minuman Senah",
    title: "Pembantu Minuman",
    description: "Membantu menyediakan minuman seperti teh, kopi, jus dan smoothies. Belajar cara menyediakan minuman dengan cepat.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM8.00/sejam",
    contactWhatsapp: "60123456790",
    preferredGender: JobGenderType.OPEN,
    location: "Cafe Siswi",
    schedule: "Ahand - Khamis, 10:00 AM - 2:00 PM",
    requirements: ["Boleh belajar menyediakan minuman", "Jujur dan bertanggungjawab", "Mesra pelanggan"]
  },
  {
    id: "job-0005",
    employerId: "emp-002",
    employerName: "Cafe Siswi - Minuman Senah",
    title: "Pembantu Minuman (Petang)",
    description: "Membantu waktu Petang apabila ramai pelanggan. Tugas termasuk menyediakan minuman dan mengemas counter.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM8.00/sejam",
    contactWhatsapp: "60123456790",
    preferredGender: JobGenderType.OPEN,
    location: "Cafe' Siswi",
    schedule: "Ahand - Khamis, 2:00 PM - 5:00 PM",
    requirements: ["Bekerja dengan pantas", "Mesra pelanggan", "Boleh berdiri lama"]
  },
  {
    id: "job-0006",
    employerId: "emp-002",
    employerName: "Cafe' Siswi - Minuman Senah",
    title: "Pembantu Gantian",
    description: "Keperluan untuk menggantikan apabila staff tidak hadir. Akan dihubungi lewat WhatsApp.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM8.00/sejam",
    contactWhatsapp: "60123456790",
    preferredGender: JobGenderType.OPEN,
    location: "Cafe' Siswi",
    schedule: "Mengikut keperluan",
    requirements: ["Responsif melalui WhatsApp", "Fleksibel", "Jujur"]
  },
  {
    id: "job-0007",
    employerId: "emp-003",
    employerName: "Stall Zainab - Ayam Goreng",
    title: "Pembantu Dapur Ayam Goreng",
    description: "Membantu menyediakan ayam goreng, menggoreng dan membungkus makanan. Akan diajar cara menyediakan ayam goreng yang sedap.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM8.00/sejam",
    contactWhatsapp: "601158853148",
    preferredGender: JobGenderType.OPEN,
    location: "Kantin Siswi",
    schedule: "Ahand - Khamis, 11:00 AM - 3:00 PM",
    requirements: ["Boleh belajar memasak", "Bersetuju untuk dilatih", "Kerja fizikal ringan"]
  },
  {
    id: "job-0008",
    employerId: "emp-003",
    employerName: "Stall Zainab - Ayam Goreng",
    title: "Pembantu Counter (Makan Tengah Hari)",
    description: "Melayani pelanggan, membungkus makanan dan mengemas counter. Sesuai untuk student yang mesra dan boleh bercakap dengan pelanggan.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM8.00/sejam",
    contactWhatsapp: "601158853148",
    preferredGender: JobGenderType.OPEN,
    location: "Kantin Siswi",
    schedule: "Ahand - Khamis, 11:30 AM - 2:30 PM",
    requirements: ["Mesra pelanggan", "Boleh berniaga", "Komunikasi baik"]
  },
  {
    id: "job-0009",
    employerId: "emp-003",
    employerName: "Stall Zainab - Ayam Goreng",
    title: "Pembantu Gantian (Petang)",
    description: "Keperluan apabila staff tidak hadir waktu petang. Zainab akan hubungi melalui WhatsApp.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM8.00/sejam",
    contactWhatsapp: "601158853148",
    preferredGender: JobGenderType.OPEN,
    location: "Kantin Siswi",
    schedule: "Mengikut keperluan",
    requirements: ["Fleksibel", "Responsif", "Boleh bekerja sendiri"]
  },
  {
    id: "job-0010",
    employerId: "emp-001",
    employerName: "Kantin Umi FIK",
    title: "Pembantu Cuci Pinggan",
    description: "Membantu mencuci pinggan, gelas dan peralatan makan selepas waktu makan. Timing fleksibel.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM7.00/sejam",
    contactWhatsapp: "601119828055",
    preferredGender: JobGenderType.OPEN,
    location: "Kantin FIK",
    schedule: "Ahand - Khamis, 1:00 PM - 3:00 PM",
    requirements: ["Boleh kerja keras", "Tiada masalah dengan air", "Kerja berpasukan"]
  },
  {
    id: "job-0011",
    employerId: "emp-001",
    employerName: "Kantin Umi FIK",
    title: "Pembantu Hujung Minggu",
    description: "Keperluan untuk bekerja pada hari Sabtu untuk menampung pelajar yang balik lambat.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM9.00/sejam",
    contactWhatsapp: "601119828055",
    preferredGender: JobGenderType.OPEN,
    location: "Kantin FIK",
    schedule: "Sabtu, 8:00 AM - 2:00 PM",
    requirements: ["Boleh kerja hujung minggu", "Mesra pelanggan", "Kerja berpasukan"]
  },
  {
    id: "job-0012",
    employerId: "emp-002",
    employerName: "Cafe' Siswi - Minuman Senah",
    title: "Pembantu Cuci Gelas",
    description: "Membantu mencuci gelas dan peralatan minuman selepas waktu sibuk. Ringan dan senang.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM7.00/sejam",
    contactWhatsapp: "60123456790",
    preferredGender: JobGenderType.OPEN,
    location: "Cafe' Siswi",
    schedule: "Ahad - Khamis, 3:00 PM - 5:00 PM",
    requirements: ["Tiada masalah dengan air", "Boleh kerja pantas", "Bersih"]
  },
  {
    id: "job-0013",
    employerId: "emp-003",
    employerName: "Stall Zainab - Ayam Goreng",
    title: "Pembantu Hujung Minggu",
    description: "Keperluan untuk hari Sabtu kerana ramai pelanggan. Gaji lebih tinggi.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM9.00/sejam",
    contactWhatsapp: "601158853148",
    preferredGender: JobGenderType.OPEN,
    location: "Kantin Siswa",
    schedule: "Sabtu, 10:00 AM - 3:00 PM",
    requirements: ["Boleh kerja hujung minggu", "Bersetuju dilatih", "Kerja berpasukan"]
  },
  {
    id: "job-0014",
    employerId: "emp-001",
    employerName: "Kantin Umi FIK",
    title: "Pembantu Penyimpanan",
    description: "Membantu menyusun dan mengira stok barang di stor. Tidak perlu berinteraksi dengan pelanggan.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM7.00/sejam",
    contactWhatsapp: "601119828055",
    preferredGender: JobGenderType.OPEN,
    location: "Kantin FIK",
    schedule: "Ahad - Isnin, 9:00 AM - 11:00 AM",
    requirements: ["Organized", "Boleh mengira", "Kerja sendiri"]
  },
  {
    id: "job-0015",
    employerId: "emp-002",
    employerName: "Cafe' Siswi - Minuman Senah",
    title: "Pembantu Penghantaran Ringan",
    description: "Membantu menghantar minuman ke meja dalam cafe dan ke pejabat berdekatan. Ringan dan senang.",
    status: JobStatus.AVAILABLE,
    createdAt: "02/01/2026",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    paymentInfo: "RM7.00/sejam",
    contactWhatsapp: "60123456790",
    preferredGender: JobGenderType.OPEN,
    location: "Cafe Siswi",
    schedule: "Ahand - Khamis, 11:00 AM - 1:00 PM",
    requirements: ["Boleh berjalan lama", "Mesra", "Pantas"]
  }
];
