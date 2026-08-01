/*
    College Library Management System - Java GUI
    Made by Jaweria Shakeel
    BS Computer Science, University of Mirpurkhas

    This is a desktop version of the same library system.
    Same idea as the C++ backend, just shown with buttons
    and tables instead of a text menu.
*/

import javax.swing.*;
import java.awt.*;

public class LibraryApp {

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new LibraryApp().createAndShowGUI());
    }

    private void createAndShowGUI() {

        JFrame frame = new JFrame("College Library Management System");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(950, 600);
        frame.setLayout(new BorderLayout());

        // ---------------- HEADER ----------------
        JPanel headerPanel = new JPanel();
        headerPanel.setBackground(Color.WHITE);
        headerPanel.setLayout(new BorderLayout());
        headerPanel.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(226, 232, 240)));

        JLabel titleLabel = new JLabel("  College LMS");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 20));
        titleLabel.setForeground(new Color(15, 23, 42));
        headerPanel.add(titleLabel, BorderLayout.WEST);

        JLabel welcomeLabel = new JLabel("Welcome to College Library  ");
        welcomeLabel.setForeground(new Color(100, 116, 139));
        headerPanel.add(welcomeLabel, BorderLayout.EAST);

        frame.add(headerPanel, BorderLayout.NORTH);

        // ---------------- SIDEBAR ----------------
        JPanel sidebarPanel = new JPanel();
        sidebarPanel.setLayout(new GridLayout(7, 1, 8, 8));
        sidebarPanel.setBackground(Color.WHITE);
        sidebarPanel.setBorder(BorderFactory.createEmptyBorder(15, 10, 15, 10));
        sidebarPanel.setPreferredSize(new Dimension(180, 0));

        String[] tabs = {"Dashboard", "Books", "Students", "Issue Book", "Return Book", "Tracking", "About"};

        JTabbedPane tabbedPane = new JTabbedPane();
        tabbedPane.addTab("Dashboard", createDashboardPanel());
        tabbedPane.addTab("Books", createBooksPanel());
        tabbedPane.addTab("Students", createStudentsPanel());
        tabbedPane.addTab("Issue Book", createIssuePanel());
        tabbedPane.addTab("Return Book", createReturnPanel());
        tabbedPane.addTab("About", createAboutPanel());

        for (String tab : tabs) {
            JButton btn = new JButton(tab);
            btn.setBackground(new Color(248, 250, 252));
            btn.setForeground(new Color(51, 65, 85));
            btn.setFocusPainted(false);
            btn.setFont(new Font("Arial", Font.PLAIN, 13));
            btn.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

            // when a sidebar button is clicked, switch the tab of the same name
            btn.addActionListener(e -> {
                for (int i = 0; i < tabbedPane.getTabCount(); i++) {
                    if (tabbedPane.getTitleAt(i).equals(tab)) {
                        tabbedPane.setSelectedIndex(i);
                        break;
                    }
                }
            });

            sidebarPanel.add(btn);
        }
        frame.add(sidebarPanel, BorderLayout.WEST);

        frame.add(tabbedPane, BorderLayout.CENTER);

        // ---------------- FOOTER ----------------
        JPanel footerPanel = new JPanel();
        footerPanel.setBackground(Color.WHITE);
        footerPanel.setBorder(BorderFactory.createMatteBorder(1, 0, 0, 0, new Color(226, 232, 240)));
        JLabel footerLabel = new JLabel("Designed & Developed by Jaweria Shakeel  |  BS Computer Science, University of Mirpurkhas");
        footerLabel.setForeground(new Color(100, 116, 139));
        footerPanel.add(footerLabel);
        frame.add(footerPanel, BorderLayout.SOUTH);

        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    // ---------------- DASHBOARD TAB ----------------
    private JPanel createDashboardPanel() {
        JPanel panel = new JPanel();
        panel.setBackground(Color.WHITE);
        panel.setLayout(new GridLayout(1, 3, 15, 15));
        panel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        panel.add(makeStatCard("Total Books", "45", new Color(37, 99, 235)));
        panel.add(makeStatCard("Total Students", "120", new Color(5, 150, 105)));
        panel.add(makeStatCard("Books Issued", "12", new Color(217, 119, 6)));

        return panel;
    }

    private JPanel makeStatCard(String label, String value, Color color) {
        JPanel card = new JPanel();
        card.setLayout(new BoxLayout(card, BoxLayout.Y_AXIS));
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createLineBorder(new Color(226, 232, 240)));

        JLabel valueLabel = new JLabel(value);
        valueLabel.setFont(new Font("Arial", Font.BOLD, 26));
        valueLabel.setForeground(color);
        valueLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel textLabel = new JLabel(label);
        textLabel.setForeground(new Color(100, 116, 139));
        textLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        card.add(Box.createVerticalStrut(20));
        card.add(valueLabel);
        card.add(Box.createVerticalStrut(5));
        card.add(textLabel);
        card.add(Box.createVerticalStrut(20));

        return card;
    }

    // ---------------- BOOKS TAB ----------------
    private JPanel createBooksPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(Color.WHITE);

        String[] columns = {"Book ID", "Book Name", "Author", "Department", "Status"};
        String[][] data = {
            {"B001", "C++ Programming", "Bjarne Stroustrup", "CS", "Available"},
            {"B002", "Data Structures", "Mark Allen Weiss", "IT", "Issued"},
            {"B003", "Operating Systems", "Silberschatz", "CS", "Available"}
        };
        JTable table = new JTable(data, columns);
        table.setRowHeight(28);
        panel.add(new JScrollPane(table), BorderLayout.CENTER);

        // simple add-book form at the bottom, same idea as C++ addBook()
        JPanel formPanel = new JPanel();
        JTextField idField = new JTextField(6);
        JTextField nameField = new JTextField(12);
        JButton addButton = new JButton("Add Book");

        formPanel.add(new JLabel("ID:"));
        formPanel.add(idField);
        formPanel.add(new JLabel("Name:"));
        formPanel.add(nameField);
        formPanel.add(addButton);

        addButton.addActionListener(e -> {
            if (idField.getText().isEmpty() || nameField.getText().isEmpty()) {
                JOptionPane.showMessageDialog(panel, "Please fill Book ID and Name.");
                return;
            }
            JOptionPane.showMessageDialog(panel, "Book \"" + nameField.getText() + "\" added (demo only).");
            idField.setText("");
            nameField.setText("");
        });

        panel.add(formPanel, BorderLayout.SOUTH);
        return panel;
    }

    // ---------------- STUDENTS TAB ----------------
    private JPanel createStudentsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(Color.WHITE);

        String[] columns = {"Student ID", "Name", "Department", "Semester", "Phone"};
        String[][] data = {
            {"2k26/CS/12", "Ali Khan", "CS", "2", "0300-1234567"},
            {"2k25/IT/10", "Sara Ahmed", "IT", "4", "0301-7654321"}
        };
        JTable table = new JTable(data, columns);
        table.setRowHeight(28);
        panel.add(new JScrollPane(table), BorderLayout.CENTER);
        return panel;
    }

    // ---------------- ISSUE BOOK TAB ----------------
    private JPanel createIssuePanel() {
        JPanel panel = new JPanel();
        panel.setBackground(Color.WHITE);
        panel.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.gridx = 0;

        JTextField studentField = new JTextField(15);
        JTextField bookField = new JTextField(15);
        JButton issueButton = new JButton("Issue Book");

        gbc.gridy = 0; panel.add(new JLabel("Student ID:"), gbc);
        gbc.gridx = 1; panel.add(studentField, gbc);

        gbc.gridx = 0; gbc.gridy = 1; panel.add(new JLabel("Book ID:"), gbc);
        gbc.gridx = 1; panel.add(bookField, gbc);

        gbc.gridx = 1; gbc.gridy = 2; panel.add(issueButton, gbc);

        // this mirrors the same conditional checks as issueBook() in C++:
        // 1) student ID given  2) book ID given  -> then issue
        issueButton.addActionListener(e -> {
            if (studentField.getText().isEmpty()) {
                JOptionPane.showMessageDialog(panel, "Please enter Student ID.");
            } else if (bookField.getText().isEmpty()) {
                JOptionPane.showMessageDialog(panel, "Please enter Book ID.");
            } else {
                JOptionPane.showMessageDialog(panel, "Book issued to " + studentField.getText() + " (demo only).");
                studentField.setText("");
                bookField.setText("");
            }
        });

        return panel;
    }

    // ---------------- RETURN BOOK TAB ----------------
    private JPanel createReturnPanel() {
        JPanel panel = new JPanel();
        panel.setBackground(Color.WHITE);
        panel.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);

        JTextField bookField = new JTextField(15);
        JTextField daysLateField = new JTextField(5);
        JButton returnButton = new JButton("Return Book");

        gbc.gridx = 0; gbc.gridy = 0; panel.add(new JLabel("Book ID:"), gbc);
        gbc.gridx = 1; panel.add(bookField, gbc);

        gbc.gridx = 0; gbc.gridy = 1; panel.add(new JLabel("Days Late:"), gbc);
        gbc.gridx = 1; panel.add(daysLateField, gbc);

        gbc.gridx = 1; gbc.gridy = 2; panel.add(returnButton, gbc);

        returnButton.addActionListener(e -> {
            int daysLate = 0;
            try {
                if (!daysLateField.getText().isEmpty()) {
                    daysLate = Integer.parseInt(daysLateField.getText());
                }
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(panel, "Days Late must be a number.");
                return;
            }

            // same fine rule as calculateFine() in the C++ file: Rs. 10 per day late
            int fine = (daysLate > 0) ? daysLate * 10 : 0;

            JOptionPane.showMessageDialog(panel, "Book returned. Fine to pay: Rs. " + fine);
            bookField.setText("");
            daysLateField.setText("");
        });

        return panel;
    }

    // ---------------- ABOUT TAB ----------------
    private JPanel createAboutPanel() {
        JPanel panel = new JPanel();
        panel.setBackground(Color.WHITE);
        panel.setLayout(new BorderLayout());

        JTextArea aboutText = new JTextArea(
            "College Library Management System\n\n" +
            "This project was built to solve a real problem at our university -\n" +
            "keeping track of books, students and issue/return records without\n" +
            "relying on scattered WhatsApp messages.\n\n" +
            "The core logic (arrays, structs, loops, conditions, functions) is\n" +
            "written in C++. This Java version shows the same logic through a\n" +
            "graphical interface, and an HTML/CSS version shows it as a website."
        );
        aboutText.setEditable(false);
        aboutText.setBackground(Color.WHITE);
        aboutText.setFont(new Font("Arial", Font.PLAIN, 14));
        aboutText.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        panel.add(aboutText, BorderLayout.CENTER);
        return panel;
    }
}
