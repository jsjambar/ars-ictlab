import { Classrooms } from "./classroom/Classrooms";

export type User = {
    id:number|0,
    username:string,
    first_name:string,
    last_name:string,
    password:string,
    role_id:number, //0 = No Permission, 1 = Student, 2 = Administrator
}

export type Role = {
    id:number|null,
    name:string
}

export type Classroom = {
    id:number|null,
    name:string,
    start_time:Date,
    end_time:Date,
    is_public:boolean,
    is_disabled:boolean
    location_id:number,
    qr_code:string
}

export type Location = {
    id:number|null,
    name:string
}

export type Reservation = {
    id:number|null,
    date_of_reservation:Date,
    created_at:Date,
    start_time:Date,
    end_time:Date,
    user_id:number,
    user:User,
    classroom_id:number
}

export type Problem = {
    id:number|null,
    name:string
}

export type Ticket = {
    id: number|null,
    user_id: number|null,
    image: string,
    created_at: Date,
    problem_id: number,
    classroom_id: number,
    description: string,
    solved: boolean
}

export type ClassroomWithEvents = {
    start: Date,
    end: Date
}

export type Timeslot = {
    id: number, 
    time: string
}

export type Temperature = {
    id: number,
    classroom_id: number,
    temperature: number
}

export type Error = {num:number, msg:string}