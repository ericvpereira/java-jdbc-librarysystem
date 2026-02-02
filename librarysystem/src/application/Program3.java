package application;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import db.DB;

public class Program3 {
	
	public static void main(String[] args) {
		
		System.out.println("ATUALIZANDO PREÇO...");
		updateBookPrice();
		
	}
	
	public static void updateBookPrice() {
		Connection conn = null;
		PreparedStatement st = null;
		try {
			conn = DB.getConnection();
			
			st = conn.prepareStatement(
					"UPDATE book "
					+ "SET price = price + ? "
					+ "WHERE "
					+ "(stock = ?)");
			
			st.setDouble(1, 300);
			st.setInt(2, 4);
			
			int rowsAffected = st.executeUpdate();
			
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		finally {
			DB.closeStatement(st);
			DB.closeConnection();
		}
	}
	
	
	
}
