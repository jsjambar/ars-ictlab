export type ProcessedDate = {
    end : Number
    start : Number
}

export function getDateByTimeslot(chosenTimeslot) : ProcessedDate{
    
    var s = 0;
    var e = 0;

    switch(true){
        case (chosenTimeslot == 1): {
            s = 9;
            e = 11;
            break;
        }
        case (chosenTimeslot == 2): {
            s = 11;
            e = 13;
            break;
        }
        case (chosenTimeslot == 3): {
            s = 13;
            e = 15;
            break;
        }
        case (chosenTimeslot == 4): {
            s = 15;
            e = 17;
            break;
        }
    }

    return {start: s, end: e};
}

export function getTimeslotByTimes(start, end) : Number{
    var s = start;
    var e = end;
    var timeSlot = 0;

    switch(true){
        case (s == 9 && e == 11): {
            timeSlot = 1;
            break;
        }
        case (s == 11 && e == 13): {
            timeSlot = 2;
            break;
        }
        case (s == 13 && e == 15): {
            timeSlot = 3;
            break;
        }
        case (s == 15 && e == 17): {
            timeSlot = 4;
            break;
        }
    }

    return timeSlot;
}