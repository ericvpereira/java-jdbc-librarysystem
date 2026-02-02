package application;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import db.DB;

public class Program2 {

    public static void main(String[] args) {

        Connection conn = null;

        try {
            conn = DB.getConnection();

            System.out.println("CADASTRANDO NOVO LIVRO...");
            registerNewBook(conn);

            System.out.println("CADASTRANDO NOVO EMPRÉSTIMO...");
            registerNewLoan(conn);

        } catch (SQLException | ParseException e) {
            e.printStackTrace();
        } finally {
            DB.closeConnection();
        }
    }

    public static void registerNewBook(Connection conn) throws SQLException {
        PreparedStatement st = null;

        try {
            st = conn.prepareStatement(
                    "INSERT INTO book (title, author, price, stock) VALUES (?, ?, ?, ?)");

            st.setString(1, "Entendendo algoritmos");
            st.setString(2, "Aditya Y. Bhargava");
            st.setDouble(3, 50.0);
            st.setInt(4, 4);

            int rowsAffected = st.executeUpdate();
            System.out.println("Livro inserido! Linhas afetadas: " + rowsAffected);
        } finally {
            DB.closeStatement(st);
        }
    }

    public static void registerNewLoan(Connection conn) throws SQLException, ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        PreparedStatement st = null;

        try {
            st = conn.prepareStatement(
                    "INSERT INTO loan (book_id, user_name, loan_date) VALUES (?, ?, ?)");

            st.setInt(1, 1); // garanta que existe
            st.setString(2, "Eric Vieira");
            st.setDate(3, new java.sql.Date(sdf.parse("04/01/1999").getTime()));

            int rowsAffected = st.executeUpdate();
            System.out.println("Empréstimo registrado! Linhas afetadas: " + rowsAffected);
        } finally {
            DB.closeStatement(st);
        }
    }
}
