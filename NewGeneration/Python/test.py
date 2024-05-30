import Api

app = Api.server()

@app.get("/")
def Main():
  return "teey"
  # TODO: write code...

app.run(host="127.0.0.1", port=3000)