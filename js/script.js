$(() => {
        let register = new Register();
        let table = $('table tbody')


        if (!localStorage.getItem('students')) {
            fetch('../students.json')
                .then((response) => response.json())
                .then((json) => {
                        localStorage.setItem('students', JSON.stringify(json));
                    }
                )
        }

        for (const student of register.readStudents()) {
            let markup = `<tr><td>${student.id}</td><td>${student.name}</td><td>${student.surname}</td><td ><i class="facilities fa-solid fa-pen-to-square"></i></td><td><i class="facilities fa-solid fa-trash"></i></td></tr>`
            table.append(markup);
        }
    }
)

class Register {

    constructor() {
    }

    addStudent(student) {
        let students = JSON.parse(localStorage.getItem('students'));

        students.push(student)
        localStorage.setItem('students', JSON.stringify(students));
        return true;
    }

    readStudents() {
        return JSON.parse(localStorage.getItem('students'));
    }
}
