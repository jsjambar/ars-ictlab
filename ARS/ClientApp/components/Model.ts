import { Classrooms } from "./classroom/Classrooms";

export type User = {
    userId:number|null,
    username:string,
    firstName:string,
    lastName:string,
    password:string,
    roleId:number,
}

export type Role = {
    RoleId:number|null,
    Name:string
}

export type Classroom = {
    ClassroomId:number|null,
    name:string,
    Description:string,
    StartTime:Date,
    EndTime:Date,
    IsDisabled:boolean,
    locationId:number,
}

export type Location = {
    LocationId:number|null,
    Name:string,
    Description:string
}

export type Reservation = {
    ReservationId:number|null,
    Date:Date,
    Starttime:Date,
    Endtime:Date,
    UserId:number,
    User:User,
    ClassroomID:number,
}

export type Problem = {
    ProblemId:number|null,
    name:string,
    classroom: Classroom
}

export type Ticket = {
    ticketId: number|null,
    user: User,
    image: string,
    date: Date,
    time: Date,
    problem: Problem
    description: string
}