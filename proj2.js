// script.js
document.addEventListener('DOMContentLoaded', () => {
    const birthdayForm = document.getElementById('birthdayForm');
    const birthdayList = document.getElementById('birthdayList');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const editIndexInput = document.getElementById('editIndex');

    //  to Load saved birthdays from localStorageee
    const loadBirthdays = () => {
        const birthdays = JSON.parse(localStorage.getItem('birthdays')) || [];
        birthdayList.innerHTML = '';
        birthdays.forEach((birthday, index) => addBirthdayToList(birthday, index));
    };


    // Save birthdays to localStorageeeee
    const saveBirthdays = (birthdays) => {
        localStorage.setItem('birthdays', JSON.stringify(birthdays));
    };

    // Add birthday to the listttt
    const addBirthdayToList = (birthday, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <span>${birthday.name}</span>
            <span class="countdown">${calculateCountdown(birthday.date)}</span>
            <div class="btn-group">
                <button class="edit-btn" onclick="editBirthday(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteBirthday(${index})">Delete</button>
            </div>
        `;
        birthdayList.appendChild(li);
    };

    // Calculate countdown to the next birthday
    const calculateCountdown = (date) => {
        const now = new Date();
        let birthday = new Date(date);
        birthday.setFullYear(now.getFullYear());

        if (birthday < now) {
            birthday.setFullYear(now.getFullYear() + 1);
        }

        const timeDiff = birthday - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        return `${days} days left`;
    };

    // Handle form submission
    birthdayForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const editIndex = editIndexInput.value;

        const birthdays = JSON.parse(localStorage.getItem('birthdays')) || [];

        if (editIndex !== '') {
            // Edit mode
            birthdays[editIndex] = { name, date };
            saveBirthdays(birthdays);
            loadBirthdays();
            birthdayForm.reset();
            formTitle.textContent = 'Add a Birthday';
            submitBtn.textContent = 'Add Birthday';
            editIndexInput.value = '';
        } else {
            // Add mode
            const birthday = { name, date };
            birthdays.push(birthday);
            saveBirthdays(birthdays);
            addBirthdayToList(birthday, birthdays.length - 1);
            birthdayForm.reset();
        }
    });

    // Edit birthday
    window.editBirthday = (index) => {
        const birthdays = JSON.parse(localStorage.getItem('birthdays')) || [];
        const birthday = birthdays[index];
        
        document.getElementById('name').value = birthday.name;
        document.getElementById('date').value = birthday.date;
        editIndexInput.value = index;
        formTitle.textContent = 'Edit Birthday';
        submitBtn.textContent = 'Save Changes';
    };

    // Delete birthday
    window.deleteBirthday = (index) => {
        const birthdays = JSON.parse(localStorage.getItem('birthdays')) || [];
        birthdays.splice(index, 1);
        saveBirthdays(birthdays);
        loadBirthdays();
    };

    // Notify for upcoming birthdays
    const notifyUpcomingBirthdays = () => {
        const birthdays = JSON.parse(localStorage.getItem('birthdays')) || [];
        const now = new Date();
        const upcomingBirthdays = birthdays.filter(birthday => {
            const birthdayDate = new Date(birthday.date);
            birthdayDate.setFullYear(now.getFullYear());
            if (birthdayDate < now) {
                birthdayDate.setFullYear(now.getFullYear() + 1);
            }
            const daysLeft = Math.floor((birthdayDate - now) / (1000 * 60 * 60 * 24));
            return daysLeft <= 7; // Reminders for birthdays within the next 7 days
        });

        if (upcomingBirthdays.length > 0) {
            alert(`Upcoming Birthdays: ${upcomingBirthdays.map(b => b.name).join(', ')}`);
        }
    };

    // Initial load
    loadBirthdays();
    notifyUpcomingBirthdays();
});
