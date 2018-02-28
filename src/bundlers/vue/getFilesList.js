const getFilesList = (files) => {
    const list = {};
  
    files.forEach(file => {
        // TODO: this will cause files to override each other 
        // whenever there are two files with different extensions and identical name
        list[file.stem] = [file.path]
    });

    return list;
  }

export default getFilesList;