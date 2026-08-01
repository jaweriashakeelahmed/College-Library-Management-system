/*
    College Library Management System - script.js
    Made by Jaweria Shakeel

    This file makes the website actually work (add/search/issue/return),
    using the SAME logic as the C++ backend, just written in JavaScript
    so it can run directly in the browser without compiling anything.

    Concepts used here (same ones as library_system.cpp):
    - Arrays        -> books[], students[], issues[]  (our in-browser "database")
    - Functions     -> one function per action, same names/spirit as C++
    - Loops         -> for loops to search/filter/display data
    - Conditionals  -> if/else to enforce the same library rules
    - localStorage  -> browser's simple storage, so data survives a page refresh
                       (this is the JS equivalent of C++ saving to books.txt)
*/

// =====================================================
// STEP 1: STARTING DATA (used only the first time the
// page is opened, or after "Reset Demo Data")
// =====================================================

const DEFAULT_BOOKS = [
    { id: "B001", name: "Digital Logic Design (DLD)", author: "M. Morris Mano", department: "CS", status: "Available" },
    { id: "B002", name: "Object Oriented Programming (OOP)", author: "Robert Lafore", department: "CS", status: "Available" },
    { id: "B003", name: "C++ Programming", author: "Bjarne Stroustrup", department: "CS", status: "Available" },
    { id: "B004", name: "Data Structures", author: "Mark Allen Weiss", department: "CS", status: "Issued" },
    { id: "B005", name: "Database Systems", author: "Elmasri & Navathe", department: "CS", status: "Available" },
    { id: "B006", name: "Calculus Early Transcendentals", author: "James Stewart", department: "Mathematics", status: "Available" },
    { id: "B007", name: "Introduction to Algorithms", author: "Thomas H. Cormen", department: "CS", status: "Available" },
    { id: "B008", name: "Clean Code", author: "Robert C. Martin", department: "CS", status: "Available" },
    { id: "B009", name: "Design Patterns", author: "Erich Gamma", department: "Software Eng", status: "Issued" },
    { id: "B010", name: "Computer Networking", author: "James Kurose", department: "IT", status: "Available" },
    { id: "B011", name: "Artificial Intelligence", author: "Peter Norvig", department: "CS", status: "Available" },
    { id: "B012", name: "Operating System Concepts", author: "Abraham Silberschatz", department: "CS", status: "Available" },
];

const DEFAULT_STUDENTS = [
    { id: "2k26/CS/12", name: "Ayesha Malik", department: "CS", semester: 3, phone: "0300-1234567", issuedBooksCount: 0 },
    { id: "2k25/IT/10", name: "Zainab Tariq", department: "IT", semester: 5, phone: "0333-9876543", issuedBooksCount: 0 },
    { id: "2k24/SE/05", name: "Muhammad Abdullah", department: "Software Eng", semester: 7, phone: "0345-1122334", issuedBooksCount: 0 },
    { id: "2k26/CS/15", name: "Fatima Noor", department: "CS", semester: 2, phone: "0311-1223344", issuedBooksCount: 0 },
    { id: "2k25/CS/20", name: "Bilal Hassan", department: "CS", semester: 4, phone: "0322-1234567", issuedBooksCount: 0 },
];

const DEFAULT_ISSUES = [
    { studentID: "2k26/CS/12", studentName: "Ayesha Malik", bookID: "B004", bookName: "Data Structures",
      issueDate: "2026-07-20", expectedReturnDate: "2026-08-04", returnDate: "N/A", fine: 0, status: "Issued" },
    { studentID: "2k25/IT/10", studentName: "Zainab Tariq", bookID: "B009", bookName: "Design Patterns",
      issueDate: "2026-07-25", expectedReturnDate: "2026-08-09", returnDate: "N/A", fine: 0, status: "Issued" },
];


// =====================================================
// STEP 2: LOAD DATA (from localStorage if it exists,
// otherwise start with the defaults above)
// This is the JS version of loadData() in the C++ file.
// =====================================================

let books = JSON.parse(localStorage.getItem("lms_books")) || DEFAULT_BOOKS;
let students = JSON.parse(localStorage.getItem("lms_students")) || DEFAULT_STUDENTS;
let issues = JSON.parse(localStorage.getItem("lms_issues")) || DEFAULT_ISSUES;


// =====================================================
// STEP 3: SAVE DATA (writes our 3 arrays into localStorage)
// This is the JS version of saveData() in the C++ file.
// =====================================================

function saveData() {
    localStorage.setItem("lms_books", JSON.stringify(books));
    localStorage.setItem("lms_students", JSON.stringify(students));
    localStorage.setItem("lms_issues", JSON.stringify(issues));
}


// =====================================================
// STEP 4: SMALL HELPER - show a toast message
// (same purpose as cout << "Book Added Successfully!" in C++,
// just shown as a popup box instead of console text)
// =====================================================

function showToast(message, isError) {
    const toast = document.getElementById("toastBox");
    toast.textContent = message;
    toast.className = isError ? "toast error" : "toast success";

    // hide it again after 3 seconds
    setTimeout(() => {
        toast.className = "toast hidden";
    }, 3000);
}


// =====================================================
// STEP 5: RENDER FUNCTIONS
// These take our arrays and draw them onto the HTML page.
// Each one uses a LOOP to go through every record, exactly
// like the "for" loops in displayBooks() / displayStudents()
// in the C++ file.
// =====================================================

function renderBooks(filterText) {
    const tbody = document.getElementById("booksTableBody");
    tbody.innerHTML = ""; // clear old rows first

    for (let i = 0; i < books.length; i++) {
        const b = books[i];

        // CONDITIONAL: if a search filter is typed, skip books that don't match
        if (filterText) {
            const search = filterText.toLowerCase();
            const matches = b.id.toLowerCase().includes(search) || b.name.toLowerCase().includes(search);
            if (!matches) continue; // "continue" skips to the next loop step
        }

        const statusClass = (b.status === "Available") ? "available" : "issued";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${b.id}</td>
            <td>${b.name}</td>
            <td>${b.author}</td>
            <td>${b.department}</td>
            <td><span class="badge ${statusClass}">${b.status}</span></td>
        `;
        tbody.appendChild(row);
    }
}

function renderStudents(filterText) {
    const tbody = document.getElementById("studentsTableBody");
    tbody.innerHTML = "";

    for (let i = 0; i < students.length; i++) {
        const s = students[i];

        if (filterText) {
            const search = filterText.toLowerCase();
            const matches = s.id.toLowerCase().includes(search) || s.name.toLowerCase().includes(search);
            if (!matches) continue;
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.department}</td>
            <td>${s.semester}</td>
            <td>${s.phone}</td>
            <td>${s.issuedBooksCount}</td>
        `;
        tbody.appendChild(row);
    }
}

function renderTracking() {
    const tbody = document.getElementById("trackingTableBody");
    tbody.innerHTML = "";

    const today = new Date();

    for (let i = 0; i < issues.length; i++) {
        const r = issues[i];

        // CONDITIONAL: if it's still "Issued" but the expected date has
        // already passed, show it as "Overdue" instead (computed live,
        // same idea as IssueHistory.tsx does in the web-app version)
        let displayStatus = r.status;
        let statusClass = "issued";
        if (r.status === "Issued" && new Date(r.expectedReturnDate) < today) {
            displayStatus = "Overdue";
            statusClass = "overdue";
        } else if (r.status === "Returned") {
            statusClass = "available";
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${r.studentName}</td>
            <td>${r.bookName}</td>
            <td>${r.issueDate}</td>
            <td>${r.expectedReturnDate}</td>
            <td>${r.status === "Returned" ? "Rs. " + r.fine : "-"}</td>
            <td><span class="badge ${statusClass}">${displayStatus}</span></td>
            <td>${r.returnStatus ? r.returnStatus : "-"}</td>
        `;
        tbody.appendChild(row);
    }
}

function renderStats() {
    // LOOP-based counting, same idea as counting through an array in C++
    let issuedCount = 0;
    for (let i = 0; i < issues.length; i++) {
        if (issues[i].status === "Issued") issuedCount++;
    }

    const today = new Date();
    let overdueCount = 0;
    let onTimeCount = 0;
    for (let i = 0; i < issues.length; i++) {
        const r = issues[i];
        if (r.status === "Issued" && new Date(r.expectedReturnDate) < today) {
            overdueCount++;
        }
        if (r.status === "Returned" && (r.returnStatus === "On Time" || r.returnStatus === "Early")) {
            onTimeCount++;
        }
    }

    document.getElementById("statTotalBooks").textContent = books.length;
    document.getElementById("statTotalStudents").textContent = students.length;
    document.getElementById("statIssued").textContent = issuedCount;
    document.getElementById("statOverdue").textContent = overdueCount;
    document.getElementById("statOnTime").textContent = onTimeCount;
    document.getElementById("statSummary").textContent =
        `Total ${books.length} books and ${students.length} students are currently registered in the system.`;
}

function renderEverything() {
    renderBooks("");
    renderStudents("");
    renderTracking();
    renderStats();
}


// =====================================================
// STEP 6: CORE FUNCTIONS (same names/logic as C++)
// =====================================================

// ---- addBook() -------------------------------------------------
function addBook(id, name, author, department) {
    // CONDITIONAL: don't allow two books with the same ID
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === id) {
            showToast("A book with this ID already exists!", true);
            return false;
        }
    }

    books.push({ id: id, name: name, author: author, department: department, status: "Available" });
    saveData();
    return true;
}

// ---- addStudent() -----------------------------------------------
function addStudent(id, name, department, semester, phone) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === id) {
            showToast("A student with this ID already exists!", true);
            return false;
        }
    }

    students.push({ id: id, name: name, department: department, semester: semester, phone: phone, issuedBooksCount: 0 });
    saveData();
    return true;
}

// ---- issueBook() ------------------------------------------------
// Same nested-conditional pattern as the C++ version:
// student exists? -> under the 3-book limit? -> book exists? -> book available?
function issueBook(studentId, bookId, expectedReturnDate) {

    // find the student (LOOP)
    let sIndex = -1;
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === studentId) { sIndex = i; break; }
    }
    if (sIndex === -1) {
        showToast("Student not found!", true);
        return false;
    }

    if (students[sIndex].issuedBooksCount >= 3) {
        showToast("Limit reached! This student already has 3 books.", true);
        return false;
    }

    // find the book (LOOP)
    let bIndex = -1;
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === bookId) { bIndex = i; break; }
    }
    if (bIndex === -1) {
        showToast("Book not found!", true);
        return false;
    }

    if (books[bIndex].status === "Issued") {
        showToast("This book is already issued!", true);
        return false;
    }

    // all checks passed -> create the issue record
    const today = new Date().toISOString().split("T")[0];

    issues.unshift({
        studentID: studentId,
        studentName: students[sIndex].name,
        bookID: bookId,
        bookName: books[bIndex].name,
        issueDate: today,
        expectedReturnDate: expectedReturnDate,
        returnDate: "N/A",
        fine: 0,
        status: "Issued"
    });

    books[bIndex].status = "Issued";
    students[sIndex].issuedBooksCount++;

    saveData();
    showToast("Book issued successfully!", false);
    return true;
}

// ---- returnBook() -----------------------------------------------
// Updated to match the newer web-app version (ReturnBook.tsx):
// fine is Rs. 50 per day late, and it's calculated automatically
// by comparing expectedReturnDate with the actual return date -
// no need to type "days late" by hand anymore.
function returnBook(studentId, bookId, returnDate) {
    // find the active issue record for THIS student AND THIS book (LOOP)
    let iIndex = -1;
    for (let i = 0; i < issues.length; i++) {
        if (issues[i].studentID === studentId && issues[i].bookID === bookId && issues[i].status === "Issued") {
            iIndex = i;
            break;
        }
    }

    if (iIndex === -1) {
        showToast("No active issue record found for this student and book.", true);
        return false;
    }

    // work out how many days early/late this return is
    const expected = new Date(issues[iIndex].expectedReturnDate);
    const actual = new Date(returnDate);
    const diffTime = actual.getTime() - expected.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // CONDITIONAL: decide the return status based on the day difference
    let returnStatus;
    if (diffDays > 0) returnStatus = "Late";
    else if (diffDays < 0) returnStatus = "Early";
    else returnStatus = "On Time";

    const lateDays = diffDays > 0 ? diffDays : 0;
    const fine = calculateFine(lateDays);

    issues[iIndex].returnDate = returnDate;
    issues[iIndex].fine = fine;
    issues[iIndex].lateDays = lateDays;
    issues[iIndex].status = "Returned";
    issues[iIndex].returnStatus = returnStatus;

    // mark the book available again (LOOP)
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === bookId) { books[i].status = "Available"; break; }
    }

    // reduce the student's issued book count (LOOP)
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === studentId) {
            students[i].issuedBooksCount--;
            break;
        }
    }

    saveData();
    showToast(`Book returned! Status: ${returnStatus} | Fine: Rs. ${fine}`, false);
    return true;
}

// ---- calculateFine() ---------------------------------------------
// Rs. 50 per day late (matches the web-app version). If the book
// isn't late at all, there's no fine.
function calculateFine(daysLate) {
    if (daysLate > 0) return daysLate * 50;
    return 0;
}


// =====================================================
// STEP 7: HOOK UP THE HTML FORMS TO THE FUNCTIONS ABOVE
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    renderEverything();

    // default the date pickers to today so the user doesn't have to type it
    const todayStr = new Date().toISOString().split("T")[0];
    document.getElementById("returnDate").value = todayStr;

    // ---- Add Book form ----
    document.getElementById("addBookForm").addEventListener("submit", function (e) {
        e.preventDefault(); // stop the page from refreshing
        const id = document.getElementById("newBookId").value.trim();
        const name = document.getElementById("newBookName").value.trim();
        const author = document.getElementById("newBookAuthor").value.trim();
        const dept = document.getElementById("newBookDept").value.trim();

        if (addBook(id, name, author, dept)) {
            showToast("Book added successfully!", false);
            e.target.reset();
            renderEverything();
        }
    });

    // ---- Add Student form ----
    document.getElementById("addStudentForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("newStudentId").value.trim();
        const name = document.getElementById("newStudentName").value.trim();
        const dept = document.getElementById("newStudentDept").value.trim();
        const semester = parseInt(document.getElementById("newStudentSemester").value, 10);
        const phone = document.getElementById("newStudentPhone").value.trim();

        if (addStudent(id, name, dept, semester, phone)) {
            showToast("Student registered successfully!", false);
            e.target.reset();
            renderEverything();
        }
    });

    // ---- Issue Book form ----
    document.getElementById("issueForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const studentId = document.getElementById("issueStudentId").value.trim();
        const bookId = document.getElementById("issueBookId").value.trim();
        const returnDate = document.getElementById("issueReturnDate").value;

        if (issueBook(studentId, bookId, returnDate)) {
            e.target.reset();
            renderEverything();
        }
    });

    // ---- Return Book form ----
    document.getElementById("returnForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const studentId = document.getElementById("returnStudentId").value.trim();
        const bookId = document.getElementById("returnBookId").value.trim();
        const returnDate = document.getElementById("returnDate").value;

        if (returnBook(studentId, bookId, returnDate)) {
            e.target.reset();
            renderEverything();
        }
    });

    // ---- Student Portal form (register + issue in one step) ----
    document.getElementById("portalForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("portalName").value.trim();
        const studentClass = document.getElementById("portalClass").value.trim();
        const roll = document.getElementById("portalRoll").value.trim();
        const phone = document.getElementById("portalPhone").value.trim();
        const bookId = document.getElementById("portalBookId").value.trim();

        // CONDITIONAL: only register if this student doesn't already exist
        let alreadyExists = false;
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === roll) { alreadyExists = true; break; }
        }
        if (!alreadyExists) {
            addStudent(roll, name, studentClass, 1, phone);
        }

        // default expected return date = 15 days from today
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 15);
        const expectedReturnDate = returnDate.toISOString().split("T")[0];

        if (issueBook(roll, bookId, expectedReturnDate)) {
            e.target.reset();
            renderEverything();
        }
    });

    // ---- Live search for Books ----
    document.getElementById("bookSearchInput").addEventListener("input", function (e) {
        renderBooks(e.target.value);
    });

    // ---- Live search for Students ----
    document.getElementById("studentSearchInput").addEventListener("input", function (e) {
        renderStudents(e.target.value);
    });

    // ---- Reset Demo Data button ----
    document.getElementById("resetDataBtn").addEventListener("click", function () {
        books = JSON.parse(JSON.stringify(DEFAULT_BOOKS));
        students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
        issues = JSON.parse(JSON.stringify(DEFAULT_ISSUES));
        saveData();
        renderEverything();
        showToast("Demo data has been reset.", false);
    });

    // ---- Highlight the active sidebar link as user scrolls (simple nice-to-have) ----
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });
    navLinks[0].classList.add("active"); // Dashboard is active by default
});
