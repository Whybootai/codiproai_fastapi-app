from flask import Flask, redirect, url_for, request, jsonify
import requests
import os

app = Flask(__name__)
app.config['GOOGLE_REDIRECT_URI'] = "https://apps-lightningleadsaz.onrender.com/google_callback"
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'your_default_secret_key')

# Example API Key, you can save this in your environment variable
API_KEY = os.environ.get("API_KEY", "your_default_api_key")

@app.route('/api/cities')
def get_cities():
    state_code = request.args.get('stateCode')
    city_name = request.args.get('cityName')
    auth_header = request.headers.get('Authorization')

    if auth_header != API_KEY:
         return jsonify({"error": "Unauthorized"}), 401
    if not state_code or not city_name:
        return jsonify({"error": "State and city name are required"}), 400

    # Replace with your actual city data fetching logic
    # For this example we will just send data back.
    mock_data = {
        "cities": [
            {"name": f"{city_name} City 1", "id": 1},
            {"name": f"{city_name} City 2", "id": 2},
            {"name": f"{city_name} City 3", "id": 3}
        ]
    }
    return jsonify(mock_data)



@app.route('/google_callback')
def google_callback():
    credential = request.args.get('credential')
    # Process the credential and perform any necessary logic on the server
    print("Credential:", credential)

    # You can store the credential, user info, etc., in a session
    # You can use this for authorization for other requests as well

    # For example, you could redirect to a "logged in" view, user profile, survey
    return redirect(url_for('survey'))  # Redirect to survey route, or another page


@app.route('/verify_email')
def verify_email():
  email = request.args.get('email')
  print("Email to verify:", email)
  # Validate the email on the backend, make sure is valid
  # For exmple, send a verification email

  return redirect(url_for('survey'))

@app.route('/survey')
def survey():
    # Logic for displaying survey or other view after sign in
    # Or make a request to return the page.
    return "User is authenticated and Survey can be taken."

if __name__ == '__main__':
    app.run(debug=True)
