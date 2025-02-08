import csv
import json

# Input and output file paths
input_csv_path = r"E:\Project Folder\op-desk-duty\questions\questions1.csv"
output_csv_path = r"E:\Project Folder\op-desk-duty\questions\formatted_questions.csv"

# Define sanity loss mapping based on ranks
sanity_loss_mapping = {
    "Lieutenant": 10,
    "Captain": 12,
    "Major": 15,
    "Lieutenant Colonel": 18,
    "Colonel": 20,
    "Brigadier": 22,
    "Major General": 25,
    "Lieutenant General": 27,
    "General": 30
}

try:
    # Read the input CSV
    with open(input_csv_path, mode="r", encoding="utf-8") as infile:
        reader = csv.DictReader(infile)
        headers = reader.fieldnames

        # Print detected headers for debugging
        print(f"Detected CSV headers: {headers}")

        # Ensure required fields exist
        required_fields = ["question", "option_a", "option_b", "option_c", "correct_answer", "level"]
        for field in required_fields:
            if field not in headers:
                raise KeyError(f"Missing required field: {field}")

        # Prepare the output file
        with open(output_csv_path, mode="w", newline="", encoding="utf-8") as outfile:
            writer = csv.DictWriter(outfile, fieldnames=["situation", "sanity_loss", "solutions", "correct_solution_index", "difficulty"])
            writer.writeheader()

            for row in reader:
                # Map full correct answers to their indices
                correct_answer = row["correct_answer"].strip()

                # Find the correct index based on matching the full answer
                solutions = [row["option_a"].strip(), row["option_b"].strip(), row["option_c"].strip()]
                if correct_answer in solutions:
                    correct_solution_index = solutions.index(correct_answer)
                else:
                    print(f"Skipping row due to unmatched correct_answer: {row}")
                    continue  # Skip if no match found

                # Assign sanity loss based on rank level
                level = row["level"].strip()
                sanity_loss = sanity_loss_mapping.get(level, 10)  # Default to 10 if not found

                # Ensure "solutions" is in JSON array format
                solutions_json = json.dumps(solutions)

                # Write the formatted row
                writer.writerow({
                    "situation": row["question"],
                    "sanity_loss": sanity_loss,
                    "solutions": solutions_json,  # Write as JSON array
                    "correct_solution_index": correct_solution_index,
                    "difficulty": level
                })

    print(f"Formatted CSV has been created successfully at: {output_csv_path}")

except KeyError as e:
    print(f"Key Error: {e}. Please check the column names in your input CSV file.")
except Exception as e:
    print(f"An error occurred: {e}")
