import models

def main():
    engine, Session = models.connect()
    models.add_tables(models.Base, engine)

if __name__ == "__main__":
    main()