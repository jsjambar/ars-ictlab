export type User = {
    UserId:number|null,
    Username:string,
    Firstname:string,
    Lastname:string,
    Password:string,
    RoleId:number,
    Role:Role
}

export type Role = {
    RoleId:number|null,
    Name:string
}

export type Classroom = {
    ClassroomId:number|null,
    Name:string,
    Description:string,
    StartTime:Date,
    EndTime:Date,
    IsDisabled:boolean,
    LocationId:number,
    Location:Location
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
    Classroom:Classroom
}

export type Problem = {
    ProblemId:number|null,
    Name:string
}