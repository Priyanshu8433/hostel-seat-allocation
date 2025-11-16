export const hostels = [
  {
    id: 1,
    name: "Sunny Hostel",
  },
  {
    id: 2,
    name: "Moonlight Hostel",
  },
  {
    id: 3,
    name: "Starry Hostel",
  },
  {
    id: 4,
    name: "Oceanview Hostel",
  },
  {
    id: 5,
    name: "Mountainview Hostel",
  },
  {
    id: 6,
    name: "City Center Hostel",
  },
];

export const rooms = [
  {
    id: 1,
    hostel_id: 1,
    room_number: "A101",
    capacity: 2,
  },
  {
    id: 2,
    hostel_id: 1,
    room_number: "A102",
    capacity: 2,
  },
  {
    id: 3,
    hostel_id: 2,
    room_number: "B201",
    capacity: 3,
  },
  {
    id: 4,
    hostel_id: 2,
    room_number: "B202",
    capacity: 3,
  },
  {
    id: 5,
    hostel_id: 3,
    room_number: "C301",
    capacity: 1,
  },
  {
    id: 6,
    hostel_id: 3,
    room_number: "C302",
    capacity: 1,
  },
  {
    id: 7,
    hostel_id: 4,
    room_number: "D401",
    capacity: 2,
  },
  {
    id: 8,
    hostel_id: 4,
    room_number: "D402",
    capacity: 2,
  },
  {
    id: 9,
    hostel_id: 5,
    room_number: "E501",
    capacity: 3,
  },
  {
    id: 10,
    hostel_id: 5,
    room_number: "E502",
    capacity: 3,
  },
  {
    id: 11,
    hostel_id: 6,
    room_number: "F601",
    capacity: 2,
  },
  {
    id: 12,
    hostel_id: 6,
    room_number: "F602",
    capacity: 2,
  },
  {
    id: 13,
    hostel_id: 1,
    room_number: "A103",
    capacity: 4,
  },
];

export const applications = [
  {
    id: 1,
    student_id: 1,
    hostel_id: 2,
    status: "approved",
    created_at: "2024-01-15T10:00:00Z",
    room_id: 3,
  },
  {
    id: 2,
    student_id: 2,
    hostel_id: 1,
    status: "pending",
    created_at: "2024-01-16T10:00:00Z",
    room_id: 1,
  },
  {
    id: 3,
    student_id: 6,
    hostel_id: 3,
    status: "rejected",
    created_at: "2024-01-17T10:00:00Z",
    room_id: 5,
  },
  {
    id: 4,
    student_id: 7,
    hostel_id: 4,
    status: "approved",
    created_at: "2024-01-18T10:00:00Z",
    room_id: 7,
  },
  {
    id: 5,
    student_id: 8,
    hostel_id: 5,
    status: "approved",
    created_at: "2024-01-19T10:00:00Z",
    room_id: 9,
  },
  {
    id: 6,
    student_id: 9,
    hostel_id: 6,
    status: "pending",
    created_at: "2024-01-20T10:00:00Z",
    room_id: 11,
  },
  {
    id: 7,
    student_id: 10,
    hostel_id: 1,
    status: "pending",
    created_at: "2024-01-21T10:00:00Z",
    room_id: 2,
  },
  {
    id: 8,
    student_id: 3,
    hostel_id: 2,
    status: "pending",
    created_at: "2024-01-22T10:00:00Z",
    room_id: 4,
  },
];

export const statistics = {
  total_students: 1500,
  open_complaints: 45,
  pending_applications: 30,
  total_beds: 1200,
  allocated_beds: 950,
};

export const complaints = [
  {
    id: 1,
    student_id: 1,
    description: "The faucet in my room is leaking.",
    status: "open",
    created_at: "2024-02-01T09:00:00Z",
  },
  {
    id: 2,
    student_id: 2,
    description: "The heating system is not working properly.",
    status: "resolved",
    created_at: "2024-02-02T09:00:00Z",
  },
  {
    id: 3,
    student_id: 6,
    description: "The Wi-Fi connection is very slow.",
    status: "resolved",
    created_at: "2024-02-02T10:00:00Z",
  },
  {
    id: 4,
    student_id: 7,
    description: "The common area is not clean.",
    status: "resolved",
    created_at: "2024-02-03T09:00:00Z",
  },
  {
    id: 5,
    student_id: 8,
    description: "The lights in the hallway are flickering.",
    status: "open",
    created_at: "2024-02-04T09:00:00Z",
  },
  {
    id: 6,
    student_id: 9,
    description: "The air conditioning is too cold.",
    status: "resolved",
    created_at: "2024-02-05T09:00:00Z",
  },
  {
    id: 7,
    student_id: 10,
    description: "The mattress in my bed is uncomfortable.",
    status: "open",
    created_at: "2024-02-06T09:00:00Z",
  },
  {
    id: 8,
    student_id: 3,
    description: "The bathroom door does not close properly.",
    status: "open",
    created_at: "2024-02-07T09:00:00Z",
  },
];

export const users = [
  {
    id: 1,
    username: "john_doe",
    full_name: "John Doe",
    email: "john.doe@example.com",
    role: "student",
  },
  {
    id: 2,
    username: "jane_smith",
    full_name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "student",
  },
  {
    id: 3,
    username: "admin_user",
    full_name: "Admin User",
    email: "admin.user@example.com",
    role: "admin",
  },
  {
    id: 4,
    username: "warden_user",
    full_name: "Warden User",
    email: "warden.user@example.com",
    role: "admin",
  },
  {
    id: 5,
    username: "staff_user",
    full_name: "Staff User",
    email: "staff.user@example.com",
    role: "admin",
  },
  {
    id: 6,
    username: "alice_wonder",
    full_name: "Alice Wonder",
    email: "alice.wonder@example.com",
    role: "student",
  },
  {
    id: 7,
    username: "bob_builder",
    full_name: "Bob Builder",
    email: "bob.builder@example.com",
    role: "student",
  },
  {
    id: 8,
    username: "charlie_brown",
    full_name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "student",
  },
  {
    id: 9,
    username: "diana_prince",
    full_name: "Diana Prince",
    email: "diana.prince@example.com",
    role: "student",
  },
  {
    id: 10,
    username: "edward_snow",
    full_name: "Edward Snow",
    email: "edward.snow@example.com",
    role: "student",
  },
];

const currentUser = {
  id: 1,
  username: "john_doe",
  full_name: "John Doe",
  email: "john.doe@example.com",
  role: "student",
};

export const getCurrentUser = () => {
  return currentUser;
};
