$(async () => {
        if (!localStorage.getItem('students')) {
            await fetch('../students.json')
                .then((response) => response.json())
                .then((json) => {
                        localStorage.setItem('students', JSON.stringify(json));
                    }
                )
        }

        let register = new Register();
        let table = $('table tbody')

        populateTable()

        $(document).on('click', 'tr .edit', function (event) {
            let row = $(this.parentNode.parentNode);
            let student = register.readStudents().find(student => {
                return student.id.toString() === row.attr('id')
            })


            if (row.next().attr('id') !== 'edit-container') {
                let node = $(`<tr id="edit-container"><td colspan="5"><div style="width: 100%"><form class="d-flex" id="edit-form">
                            <div class="edit-input" ><label  for="name">Nome</label>
                            <input type="text" id="name" name="name" value="${student.name}"></div>
                            <div class="edit-input"><label for="surname">Cognome</label>
                            <input type="text" id="surname" name="surname" value="${student.surname}"></div>
                            <div class="edit-input"><label for="score">Voto</label>
                            <input type="number" id="score" name="score" value="${student.vote.score}"></div>
                            <div class="edit-input"><label for="data">Data</label>
                            <input type="date" id="date" name="data" value="${student.vote.date}"></div>
                            <div class="edit-input"><label for="comment">Commento</label>
                            <textarea name="comment" id="comment" id="comment">${student.vote.comment}</textarea></div>
                            <div class="edit-input mt-2"><label for="submit-edit"></label>
                            <input type="button" class="btn btn-danger submit-edit" name="submit-edit" id="submit-edit" value="Modifica"></div>
                            </form></div></td></tr>`);
                row.after(node)
                return
            }
            row.next().remove();
        });

        $(document).on('click', '#edit-container #submit-edit', function (event) {
            event.preventDefault()
            let id = $(this).closest("tr").prev().attr('id');
            let parent = $(this).closest('tr');
            let student = {
                id: id,
                name: parent.find('#name').val(),
                surname: parent.find('#surname').val(),
                score: parent.find('#score').val(),
                date: parent.find('#date').val(),
                comment: parent.find('#comment').val(),
            }

            if (register.updateStudent(student)) {
                $("table tbody tr").remove();
                populateTable();
            }

        });


        function populateTable() {
            for (const student of register.readStudents()) {
                let markup = `<tr id="${student.id}"><td>${student.id}</td><td>${student.name}</td><td>${student.surname}</td>
                                <td ><i title="Clicca per modificare" class="edit facilities fa-solid fa-pen-to-square"></i></td><td><i class="trash facilities fa-solid fa-trash"></i></td>
                                </tr>`
                table.append(markup);
            }
        }
    }
)


class Register {
    #students;

    constructor() {
        this.#students = JSON.parse(localStorage.getItem('students'))
    }

    get students() {
        return this.#students
    }

    addStudent(student) {
        this.students.push(student)
        localStorage.setItem('students', JSON.stringify(this.students));
        return true;
    }

    readStudents() {
        return this.students;
    }

    updateStudent(student) {
        for (const stud of this.students) {
            if (stud.id.toString() === student.id) {
                stud.name = student.name;
                stud.surname = student.surname;
                stud.vote.score = student.score;
                stud.vote.date = student.date;
                stud.vote.comment = student.comment;
            }
        }

        localStorage.setItem('students', JSON.stringify(this.students))
        return true;
    }
}
