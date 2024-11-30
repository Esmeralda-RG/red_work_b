export const capitalizeFullName = (fullName: string): string => {
    return fullName
        .split(' ')  
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  
        .join(' ');  
};

export const capitalizeJob = (job: string): string => {
    const words = job.split(' ');
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase(); 
    return words.join(' ');
};
