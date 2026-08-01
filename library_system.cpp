/*
    College Library Management System - C++ Backend
    Made by Jaweria Shakeel
    BS Computer Science, University of Mirpurkhas

    This is the real logic of the library system.
    Everything the website shows (add book, issue book, return book,
    fines etc.) is based on this same code.
*/

#include <iostream>
#include <fstream>
#include <string>

using namespace std;

// ---------------------------------------------------
// constants - maximum records our arrays can hold
// ---------------------------------------------------
const int MAX_BOOKS = 1000;
const int MAX_STUDENTS = 500;
const int MAX_ISSUES = 2000;

// ---------------------------------------------------
// structures - these define what one Book / Student /
// IssueRecord actually looks like
// ---------------------------------------------------
struct Book {
    string bookID;
    string bookName;
    string author;
    string department;
    string status; // "Available" or "Issued"
};

struct Student {
    string studentID;
    string studentName;
    string department;
    int semester;
    string phone;
    int issuedBooksCount;
};

struct IssueRecord {
    string studentID;
    string studentName;
    string bookID;
    string bookName;
    string issueDate;
    string expectedReturnDate;
    string returnDate;
    int fine;
    string status; // "Issued" or "Returned"
};

// ---------------------------------------------------
// arrays - our "database" while the program is running
// ---------------------------------------------------
Book books[MAX_BOOKS];
int bookCount = 0;

Student students[MAX_STUDENTS];
int studentCount = 0;

IssueRecord issues[MAX_ISSUES];
int issueCount = 0;

// ---------------------------------------------------
// function prototypes (declared here, written below)
// ---------------------------------------------------
void addBook();
void searchBook();
void displayBooks();

void addStudent();
void displayStudents();

void issueBook();
void returnBook();
int calculateFine(int daysLate);

void saveData();
void loadData();


// =====================================================
// MAIN FUNCTION
// =====================================================
int main() {

    loadData();   // load whatever was saved last time

    int choice;

    do {
        cout << "\n=========================================\n";
        cout << "   College Library Management System\n";
        cout << "=========================================\n";
        cout << "1. Add Book\n";
        cout << "2. Search Book\n";
        cout << "3. Display All Books\n";
        cout << "4. Add Student\n";
        cout << "5. Display All Students\n";
        cout << "6. Issue Book\n";
        cout << "7. Return Book\n";
        cout << "0. Exit\n";
        cout << "=========================================\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1: addBook(); break;
            case 2: searchBook(); break;
            case 3: displayBooks(); break;
            case 4: addStudent(); break;
            case 5: displayStudents(); break;
            case 6: issueBook(); break;
            case 7: returnBook(); break;
            case 0:
                saveData();
                cout << "Exiting system. Data saved successfully.\n";
                break;
            default:
                cout << "Invalid choice! Try again.\n";
        }

    } while (choice != 0);

    return 0;
}


// =====================================================
// BOOK MANAGEMENT
// =====================================================

void addBook() {
    // check if array still has space
    if (bookCount >= MAX_BOOKS) {
        cout << "Library is full! Cannot add more books.\n";
        return;
    }

    Book b;
    cout << "Enter Book ID: ";
    cin >> b.bookID;
    cin.ignore();
    cout << "Enter Book Name: ";
    getline(cin, b.bookName);
    cout << "Enter Author Name: ";
    getline(cin, b.author);
    cout << "Enter Department: ";
    getline(cin, b.department);

    b.status = "Available"; // every new book starts as available

    books[bookCount] = b;
    bookCount++;

    saveData();
    cout << "Book Added Successfully!\n";
}

void searchBook() {
    string id;
    cout << "Enter Book ID to Search: ";
    cin >> id;

    bool found = false;

    for (int i = 0; i < bookCount; i++) {
        if (books[i].bookID == id) {
            cout << "--- Book Found ---\n";
            cout << "ID: " << books[i].bookID << "\n";
            cout << "Name: " << books[i].bookName << "\n";
            cout << "Author: " << books[i].author << "\n";
            cout << "Status: " << books[i].status << "\n";
            found = true;
            break;
        }
    }

    if (!found) {
        cout << "Book not found.\n";
    }
}

void displayBooks() {
    cout << "--- All Books ---\n";
    for (int i = 0; i < bookCount; i++) {
        cout << books[i].bookID << " | " << books[i].bookName
             << " | " << books[i].status << "\n";
    }
}


// =====================================================
// STUDENT MANAGEMENT
// =====================================================

void addStudent() {
    if (studentCount >= MAX_STUDENTS) {
        cout << "Student list is full!\n";
        return;
    }

    Student s;
    cout << "Enter Student ID: ";
    cin >> s.studentID;
    cin.ignore();
    cout << "Enter Student Name: ";
    getline(cin, s.studentName);
    cout << "Enter Department: ";
    getline(cin, s.department);
    cout << "Enter Semester: ";
    cin >> s.semester;
    cin.ignore();
    cout << "Enter Phone Number: ";
    getline(cin, s.phone);

    s.issuedBooksCount = 0; // new student has no books yet

    students[studentCount] = s;
    studentCount++;

    saveData();
    cout << "Student Added Successfully!\n";
}

void displayStudents() {
    cout << "--- All Students ---\n";
    for (int i = 0; i < studentCount; i++) {
        cout << students[i].studentID << " | " << students[i].studentName
             << " | Issued: " << students[i].issuedBooksCount << "\n";
    }
}


// =====================================================
// ISSUE / RETURN LOGIC
// =====================================================

void issueBook() {
    string sID, bID, iDate, eDate;

    cout << "Enter Student ID: ";
    cin >> sID;

    // find the student first
    int sIndex = -1;
    for (int i = 0; i < studentCount; i++) {
        if (students[i].studentID == sID) {
            sIndex = i;
            break;
        }
    }

    if (sIndex == -1) {
        cout << "Student not found!\n";
        return;
    }

    // library rule: a student cannot hold more than 3 books
    if (students[sIndex].issuedBooksCount >= 3) {
        cout << "Limit Reached! Student already has 3 books.\n";
        return;
    }

    cout << "Enter Book ID: ";
    cin >> bID;

    // find the book next
    int bIndex = -1;
    for (int i = 0; i < bookCount; i++) {
        if (books[i].bookID == bID) {
            bIndex = i;
            break;
        }
    }

    if (bIndex == -1) {
        cout << "Book not found!\n";
        return;
    }

    if (books[bIndex].status == "Issued") {
        cout << "Book Already Issued!\n";
        return;
    }

    cout << "Enter Issue Date (DD/MM/YYYY): ";
    cin >> iDate;
    cout << "Enter Expected Return Date (DD/MM/YYYY): ";
    cin >> eDate;

    // all checks passed, now create the issue record
    IssueRecord record;
    record.studentID = sID;
    record.studentName = students[sIndex].studentName;
    record.bookID = bID;
    record.bookName = books[bIndex].bookName;
    record.issueDate = iDate;
    record.expectedReturnDate = eDate;
    record.returnDate = "N/A";
    record.fine = 0;
    record.status = "Issued";

    issues[issueCount] = record;
    issueCount++;

    books[bIndex].status = "Issued";
    students[sIndex].issuedBooksCount++;

    saveData();
    cout << "Book Issued Successfully!\n";
}

void returnBook() {
    string bID;
    cout << "Enter Book ID to Return: ";
    cin >> bID;

    // find the active issue record for this book
    int iIndex = -1;
    for (int i = 0; i < issueCount; i++) {
        if (issues[i].bookID == bID && issues[i].status == "Issued") {
            iIndex = i;
            break;
        }
    }

    if (iIndex == -1) {
        cout << "No active issue record found for this Book ID.\n";
        return;
    }

    int daysLate;
    cout << "Enter Return Date (DD/MM/YYYY): ";
    cin >> issues[iIndex].returnDate;
    cout << "Enter Days Late (0 if on time): ";
    cin >> daysLate;

    issues[iIndex].fine = calculateFine(daysLate);
    issues[iIndex].status = "Returned";

    // update the book back to available
    for (int i = 0; i < bookCount; i++) {
        if (books[i].bookID == bID) {
            books[i].status = "Available";
            break;
        }
    }

    // reduce the student's issued book count
    for (int i = 0; i < studentCount; i++) {
        if (students[i].studentID == issues[iIndex].studentID) {
            students[i].issuedBooksCount--;
            break;
        }
    }

    saveData();
    cout << "Book Returned Successfully! Fine to pay: Rs. " << issues[iIndex].fine << "\n";
}

int calculateFine(int daysLate) {
    if (daysLate > 0) {
        return daysLate * 10; // Rs. 10 per day late
    }
    return 0;
}


// =====================================================
// FILE HANDLING (so data is not lost when program closes)
// =====================================================

void saveData() {
    ofstream bookFile("books.txt");
    for (int i = 0; i < bookCount; i++) {
        bookFile << books[i].bookID << "\n"
                 << books[i].bookName << "\n"
                 << books[i].author << "\n"
                 << books[i].department << "\n"
                 << books[i].status << "\n";
    }
    bookFile.close();

    ofstream studentFile("students.txt");
    for (int i = 0; i < studentCount; i++) {
        studentFile << students[i].studentID << "\n"
                    << students[i].studentName << "\n"
                    << students[i].department << "\n"
                    << students[i].semester << "\n"
                    << students[i].phone << "\n"
                    << students[i].issuedBooksCount << "\n";
    }
    studentFile.close();

    ofstream issueFile("issue.txt");
    for (int i = 0; i < issueCount; i++) {
        issueFile << issues[i].studentID << "\n"
                  << issues[i].studentName << "\n"
                  << issues[i].bookID << "\n"
                  << issues[i].bookName << "\n"
                  << issues[i].issueDate << "\n"
                  << issues[i].expectedReturnDate << "\n"
                  << issues[i].returnDate << "\n"
                  << issues[i].fine << "\n"
                  << issues[i].status << "\n";
    }
    issueFile.close();
}

void loadData() {
    ifstream bookFile("books.txt");
    if (bookFile.is_open()) {
        while (bookFile >> books[bookCount].bookID) {
            bookFile.ignore();
            getline(bookFile, books[bookCount].bookName);
            getline(bookFile, books[bookCount].author);
            getline(bookFile, books[bookCount].department);
            getline(bookFile, books[bookCount].status);
            bookCount++;
        }
        bookFile.close();
    }

    ifstream studentFile("students.txt");
    if (studentFile.is_open()) {
        while (studentFile >> students[studentCount].studentID) {
            studentFile.ignore();
            getline(studentFile, students[studentCount].studentName);
            getline(studentFile, students[studentCount].department);
            studentFile >> students[studentCount].semester;
            studentFile.ignore();
            getline(studentFile, students[studentCount].phone);
            studentFile >> students[studentCount].issuedBooksCount;
            studentFile.ignore();
            studentCount++;
        }
        studentFile.close();
    }

    ifstream issueFile("issue.txt");
    if (issueFile.is_open()) {
        while (issueFile >> issues[issueCount].studentID) {
            issueFile.ignore();
            getline(issueFile, issues[issueCount].studentName);
            getline(issueFile, issues[issueCount].bookID);
            getline(issueFile, issues[issueCount].bookName);
            getline(issueFile, issues[issueCount].issueDate);
            getline(issueFile, issues[issueCount].expectedReturnDate);
            getline(issueFile, issues[issueCount].returnDate);
            issueFile >> issues[issueCount].fine;
            issueFile.ignore();
            getline(issueFile, issues[issueCount].status);
            issueCount++;
        }
        issueFile.close();
    }
}
