import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;
import java.io.FileWriter;
import java.util.regex.*;

public class ReadJsonAsString {
    public static void main(String[] args) throws Exception {
        String file = "./school.txt";
        String json = readFileAsString(file);
        json = json.replaceAll(Pattern.quote("},{"),"}, \n {");

        try {
            FileWriter myWriter = new FileWriter("schools.json");
            myWriter.write(json);
            myWriter.close();
            System.out.println("Successfully wrote to the file.");
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
          }     
        System.out.println(json);
    }

    public static String readFileAsString(String file) throws Exception {
        return new String(Files.readAllBytes(Paths.get(file)));
    }
}