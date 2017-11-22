from flask import Flask, request, jsonify
import socket, random

app = Flask(__name__, static_url_path='/static')

cs_host = "localhost"
cs_port = 1024
cs_addr = (cs_host,cs_port)

cs_bot = 'anabotelho'
cs_master = 'm4th3u5'

@app.route('/')
def index():
		resp = app.make_response(redirect_to_index )  

@app.route('/static/response', methods=['POST'])
def response():
		result = request.get_json()
		username = request.remote_addr + request.headers.get('User-Agent')
		message = username+chr(0)+cs_bot+chr(0)+result+chr(0)
		print(result)
		if len(result):
			split_result = result.split(' ')[0]
			if split_result==":reset" or split_result==":pos" or split_result==":why" or split_result==":build":
				message = cs_master+chr(0)+cs_bot+chr(0)+result+chr(0)
		message = message.encode("utf-8")
		client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		client_socket.bind(("localhost",random.randrange(1025)+1024))
		client_socket.connect(cs_addr)
		client_socket.send(message)
		data_out = ''
		while True:
			buf = client_socket.recv(64)
			if len(buf) > 0:
				data_out += buf.decode("utf-8")
			else:
				break
		client_socket.close()
		print(data_out)
		return jsonify(data_out)


if __name__ == "__main__":
	app.run(host="165.227.49.154", threaded=True)



'''if result[len(result) - len(result.lstrip())] == ':':
				if result.rsplit(':',3)[1] == 'pWd':
					result = ':'+result.rsplit(':',3)[2]
				else:
					result = result.rsplit(':',3)[1]'''
