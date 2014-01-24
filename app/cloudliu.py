import sqlite3

from os.path import join, dirname, realpath
from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

database = join(dirname(realpath(__file__)), 'res/boshiamy.db')
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/query.json", methods=['POST'])
def query():
    chs = request.form.getlist('keyStrokes[]', int)
    query_str = 'SELECT phrase FROM phrases WHERE '

    for j in range(5):
        if j >= len(chs):
            break
        if chs[j] == 190: # '.'
            alpha = '56'
        elif chs[j] == 188: # ','
            alpha = '55'
        elif chs[j] == 222: # "'"
            alpha = '27'
        elif chs[j] == 219: # '['
            alpha = '45'
        elif chs[j] == 221: # ']'
            alpha = '46'
        else:
            alpha = str(chs[j] - ord('A') + 1)
        query_str += 'm%d=%s AND ' % (j, alpha)

    query_str = query_str.strip(' AND ')
    query_str += ' ORDER BY -freq LIMIT 10;'

    conn = sqlite3.connect(database)
    cursor = conn.cursor()
    result = cursor.execute(query_str).fetchall()
    print query_str

    return jsonify({'candidates': [r[0] for r in result]})

if __name__ == "__main__":
    app.debug = True
    app.run()
