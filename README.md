# GUIDE TO PROJECT

## 1. Create a project folder & virtual environment

- Hopefully you have anaconda distribution installed
- Create a project folder
- Open terminal and navigate to your project folder and then type the command below to create a virtual environment. You may give your virtual environment any name but best if it doesn't have any spaces. If it does, you can enclose it in quotation marks. Make sure you provide the python version installed on your device.

```bash
    conda create -p my_venv python=3.12 -y
```

- Once created, you will automatically be prompted to active the newly created virtual environment. The code to do so will also be provided.

```bash
    conda activate Desktop/projects/my_venv
```

- Once activated, you should see the path to your virtual environment appear in terminal. If not, you can re-run the conda activate command. You can also verify the creation of the virtual environment using the below command. "\*" indicates the environment you are currently working in.

```bash
    conda env list
```

- now you can open from vscode from your project folder using the command below.

```bash
    code .
```

---

## 2. Installing project requirements

- `requirements.txt` contains all the libraries used for this project, install them using the following command in your vscode terminal, MAKE SURE YOUR VIRTUAL ENVIRONMENT IS ACTIVATED! Otherwise you will install these libraries globally! If `pip3` doesn't work you may have to use `pip` instead.

```bash
    pip3 install -r requirements.txt
```

---

## 3. File Structure

- Below is the expected initial file structure, please only create the folders mentioned. If not mentioned, it means these files/ folders will be created during the execution of the project.

```
PROJECT FOLDER
|   app.py
|   database_functionality.py
|   requirements.txt
|   README.md
|
|-------- datasets
|            |      climate.db (created automatically during project execution)
|            |      schema.sql
|            |
|            |-------- original (please create this folder)
|            |
|            |
|            |
|            |-------- final_datasets (please create this folder)
|
|
|
|------- notebooks
|
|
|
|------- static
|            |------ favicon
|            |------ css
|            |------- js
|            |------- imgs
|
|
|
|------- templates
|
|
|
|------- <your_virtual_environment_folder_name>
```

---

# 4. Where to begin?

- Navigate to `notebooks` and execute each notebook in order to prepare data and create the database.

- `app.py` is the brains of the web application.

- In terminal type the following command to start the flask web server and start using the web application. Click the link shown and the application should open in your browser.

```bash
    python3 app.py
```

- FINAL NOTE: make sure you activate the virtual environment you have created for this project each time you are working on it. This ensures you are working in an isolated environment and avoid potentially conflicting libraries and packages that are installed on an operating system.
