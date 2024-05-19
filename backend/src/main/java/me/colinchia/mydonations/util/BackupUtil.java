package me.colinchia.mydonations.util;

import jakarta.ejb.Schedule;
import jakarta.ejb.Singleton;
import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import org.eclipse.microprofile.config.ConfigProvider;

@Singleton
public class BackupUtil {
    private DataSource dataSource;

    public BackupUtil() {
        try {
            String dataSourceLookup = ConfigProvider.getConfig().getValue("DATASOURCE_JTA", String.class);
            InitialContext ctx = new InitialContext();
            dataSource = (DataSource) ctx.lookup(dataSourceLookup);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to lookup datasource.", e);
        }
    }

    @Schedule(hour="0", minute="0", second="0", persistent=false)
    public void performBackup() {
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");
        Date now = new Date();
        String strDate = sdfDate.format(now);
        String backupsDir = ConfigProvider.getConfig().getValue("BACKUPS_PATH", String.class);
        String fileName = backupsDir + File.separator + "backup-" + strDate + ".csv";

        try {
            File backupFolder = new File(backupsDir);
            if (!backupFolder.exists()) {
                boolean wasDirectoryMade = backupFolder.mkdirs();
                if (!wasDirectoryMade) {
                    System.err.println("Failed to create backups directory. Check permissions.");
                    return;
                }
            }

            Connection con = dataSource.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM donation WHERE DATE(created_at) = CURDATE()");
            PrintWriter pw = new PrintWriter(new FileWriter(fileName));
            System.out.println("Attempting to create backup file at: " + new File(fileName).getAbsolutePath());

            try (con; stmt; rs; pw) {
                while (rs.next()) {
                    String donationRecord = rs.getInt("id") + "," +
                            escapeCsv(rs.getString("donor_name")) + "," +
                            escapeCsv(rs.getString("donor_email")) + "," +
                            escapeCsv(rs.getString("donor_comments")) + "," +
                            escapeCsv(rs.getString("donation_currency")) + "," +
                            rs.getBigDecimal("donation_amount").toString() + "," +
                            escapeCsv(rs.getString("transaction_id")) + "," +
                            escapeCsv(rs.getString("transaction_mode")) + "," +
                            escapeCsv(rs.getString("transaction_status")) + "," +
                            escapeCsv(rs.getString("request")) + "," +
                            escapeCsv(rs.getString("response")) + "," +
                            "\"" + sdfDate.format(rs.getTimestamp("created_at")) + "\"";
                    pw.println(donationRecord);
                }
                System.out.println("Backup performed successfully.");
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        String escapedValue = value.replace("\"", "\"\"");
        if (escapedValue.contains(",") || escapedValue.contains("\n")) {
            escapedValue = "\"" + escapedValue + "\"";
        }
        return escapedValue;
    }
}
