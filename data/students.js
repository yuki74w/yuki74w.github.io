class department{

};

class faculty{
    constructor(name) {
        this.name = name;
    }
};

const faculty_I = new faculty("I類");
const faculty_II = new faculty("II類");
const faculty_III = new faculty("III類");

const faculty = {};

class student{
    constructor(grade, faculty) {
        this.grade = grade;
        this.faculty = faculty;
    }
};

export {faculty_I, faculty_II, faculty_III, student}