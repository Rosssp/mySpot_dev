export default function useFormattedDate(dateString) {
    const date = new Date(dateString);

    const options = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    };
    const formattedDate = date
        .toLocaleDateString(undefined, options)
        .split(".")
        .reverse()
        .join(".");

    return formattedDate;
}
