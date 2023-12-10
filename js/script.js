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
        let lastId;
        setInterval(() => {
            lastId = register.readStudents().at(register.readStudents().length - 1).id;
        }, 500)
        let currentDate = new Date(Date.now())
        $('#new-date').attr('max', currentDate.toISOString().split('T')[0])


        let table = $('table tbody');
        let inputs = $('#new-student-insert :input');
        let insertStudentDialog = $("#new-student-dialog").dialog({
            autoOpen: false,
            buttons: [
                {
                    text: 'Invia',
                    click: () => {
                        let student = {};
                        if ($('#new-name').val() == "" || $('#new-surname').val() == "") {
                            $('#insertion-result').html('Inserisci i campi obbligatori.');
                            return
                        }
                        inputs.each(function () {
                            student = {
                                id: lastId + 1,
                                name: $('#new-name').val(),
                                surname: $('#new-surname').val(),
                                vote: {
                                    score: $('#new-score').val(),
                                    date: $('#new-date').val(),
                                    comment: $('#new-comment').val()
                                },
                            }
                        })
                        if (register.addStudent(student)) {
                            inputs.each(function () {
                                $(this).val('')
                            })
                            $('#insertion-result').html('Studente inserito con successo.');
                        }
                    }
                }
            ],
            close: () => {
                $('#insertion-result').html('')
                $("table tbody tr").remove();
                populateTable();
            },
            closeOnEscape: false,
            draggable: false,
            modal: true,
            position: {my: "center", at: "center", of: window},
            resizable: false,
            title: 'Inserisci studente',
        })

        let confirmDeletionDialog = $("#confirm-deletion").dialog({
            dialogClass: "confirm-deletion-popup",
            autoOpen: false,
            buttons: [
                {
                    text: 'Si',
                    "id": "yes-button",
                    click: () => {
                        if (register.deleteStudent(confirmDeletionDialog.data('parent'))) {
                            $('#yes-button, #no-button').addClass('d-none');
                            $('#close-button').removeClass('d-none');
                            $('#confirm-deletion-result').html('Studente eliminato correttamente.')
                        }

                    }
                },
                {
                    text: 'No',
                    "id": "no-button",
                    click: () => {
                        confirmDeletionDialog.dialog('close')
                    }
                },
                {
                    text: 'Close',
                    "id": "close-button",
                    "class": "d-none",
                    click: () => {
                        $('#yes-button, #no-button').removeClass('d-none');
                        $('#close-button').addClass('d-none');
                        confirmDeletionDialog.dialog('close')
                    }
                }
            ],
            close: () => {
                $('#confirm-deletion-result').html('')
                $("table tbody tr").remove();
                populateTable();
            },
            closeOnEscape: false,
            draggable: false,
            modal: true,
            position: {my: "center", at: "center", of: window},
            resizable: false,
            title: 'Conferma eliminazione',
        })

        populateTable()

        $(document).on('click', 'tr .edit', function (event) {
            let row = $(this.parentNode.parentNode);
            let student = register.readStudents().find(student => {
                return student.id.toString() === row.attr('id')
            })


            if (row.next().attr('id') !== 'edit-container') {
                let node = $(`<tr id="edit-container"><td colspan="5"><div><form class="d-flex flex-column flex-md-row" id="edit-form">
                            <div class="edit-input d-flex flex-column" ><label  for="name">Nome</label>
                            <input type="text" id="name" name="name" value="${student.name}"></div>
                            <div class="edit-input d-flex flex-column"><label for="surname">Cognome</label>
                            <input type="text" id="surname" name="surname" value="${student.surname}"></div>
                            <div class="edit-input d-flex flex-column"><label for="score">Voto</label>
                            <input type="number" id="score" name="score" value="${student.vote.score}"></div>
                            <div class="edit-input d-flex flex-column"><label for="data">Data</label>
                            <input type="date" id="date" name="data" value="${student.vote.date}"></div>
                            <div class="edit-input d-flex flex-column"><label for="comment">Commento</label>
                            <textarea name="comment" id="comment" id="comment">${student.vote.comment}</textarea></div>
                            <div class="edit-input d-flex flex-column mt-2"><label for="submit-edit"></label>
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


        $(document).on('click', 'div #insert-student', function (event) {
            let titleBarCloseButton = $('.ui-dialog-titlebar .ui-dialog-titlebar-close')
            titleBarCloseButton.html('<i class="fa-solid fa-xmark"></i>');
            titleBarCloseButton.addClass('d-flex align-items-center justify-content-center btn btn-danger')
            $('.ui-dialog-buttonset button').addClass('btn btn-danger')
            insertStudentDialog.dialog('open');
        })

        $(document).on('click', 'tr .trash', function (event) {
            let titleBarCloseButton = $('.ui-dialog-titlebar .ui-dialog-titlebar-close')
            titleBarCloseButton.html('<i class="fa-solid fa-xmark"></i>');
            titleBarCloseButton.addClass('d-flex align-items-center justify-content-center btn btn-danger')
            $('.ui-dialog-buttonset button').addClass('btn btn-danger');
            confirmDeletionDialog.data('parent', $(this).closest('tr').attr('id')).dialog('open');
        })

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

    deleteStudent(id) {
        for (const student of this.students) {
            if (student.id.toString() === id) {
                this.students.splice(this.students.indexOf(student), 1)
                localStorage.setItem('students', JSON.stringify(this.students))
                return true
            }
        }
        return false;
    }
}
