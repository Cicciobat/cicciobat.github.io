$(() => {
        if (!localStorage.getItem('students')) {
            fetch('../students.json')
                .then((response) => response.json())
                .then((json) => {
                        localStorage.setItem('students', JSON.stringify(json));
                    }
                )
        }
    }
)

