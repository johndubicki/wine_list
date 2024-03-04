from wine_list import create_app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
else:
    pass