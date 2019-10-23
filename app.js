const { exec, spawn } = require("child_process");
const fs = require("fs");

const gitClone = () => {
    return new Promise((resolve, reject) => {
        exec("git clone https://github.com/jehincastic/my-create-react-app.git", (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });
};

const localFileChanges = (path, newPath, fileName) => {
    return new Promise((resolve, reject) => {
        fs.rename(path, newPath, err => {
            if (err) {
                reject(err);
            } else {
                fs.readFile(`${newPath}\\package.json`, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        const jsonData = JSON.parse(data);
                        jsonData['name'] = fileName;
                        resolve();
                    }
                });
            }
        });
    });
};

const npmInstall = (fileName) => {
    return new Promise((resolve, reject) => {
        const command = 'npm';
        const args = ['install', '--save', 'react']
        const npmI = spawn(command, args, { stdio: 'inherit', cwd: `./${fileName}`});
        npmI
        .on('close', code => {
            if (code !== 0) {
                reject({
                command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        })
        .on('error', code => {
            reject(code)
        })
    });
}

if (process.argv.length >= 3) {
    const currentDir = process.cwd();
    const path = currentDir + "\\my-create-react-app";
    const fileName = process.argv[2];
    const newPath = `${currentDir}\\${fileName}`;

    gitClone()
        .then(() => {
            localFileChanges(path, newPath, fileName).then(() => {
                npmInstall(fileName)
                    .then(() => {
                        console.log("Done")
                    })
                    .catch(err => {
                        console.log("Unable to install dependencies");
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log("Could not change file name");
                console.log(err);
            });
        })
        .catch(err => {
            console.log("Could not clone from git");
            console.log(err);
        });
} else {
    console.log("Please provide a name for the React App");
}