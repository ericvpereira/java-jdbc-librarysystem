package application;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import db.DB;

public class Program {
	
	public static void main(String[] args) {
		
		searchBook();
		System.out.println();
		searchStock();
		System.out.println();
		searchLoan();
		
		
	}

	private static void searchBook() {
		Connection conn = null;
		Statement st = null;
		ResultSet rs = null;
		
	
		try {
			conn = DB.getConnection();
			
			st = conn.createStatement();
			
			rs = st.executeQuery("select * from book");
			
			System.out.println("BUSCANDO LIVROS...");
			while (rs.next()) {
				System.out.println(rs.getString("Title"));
			}
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	private static void searchStock() {
		Connection conn = null;
		Statement st = null;
		ResultSet rs = null;
		
	
		try {
			conn = DB.getConnection();
			
			st = conn.createStatement();
			
			rs = st.executeQuery("select * from book "
					+ "where stock > 2");
			
			System.out.println("BUSCANDO LIVROS COM ESTOQUE MAIOR QUE 2...");
			while (rs.next()) {
				System.out.println(rs.getString("Title"));
			}
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	private static void searchLoan() {
		Connection conn = null;
		Statement st = null;
		ResultSet rs = null;
		
	
		try {
			conn = DB.getConnection();
			
			st = conn.createStatement();
			
			rs = st.executeQuery("select * from loan");
			
			System.out.println("BUSCANDO USUARIOS QUE PEGARAM LIVRO EMPRESTADO...");
			while (rs.next()) {
				System.out.println(rs.getString("user_name"));
			}
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		finally {
			DB.closeStatement(st);
			DB.closeResultSet(rs);
			DB.closeConnection();
		}	
	}
}
