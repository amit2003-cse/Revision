export const fetchTopics = async () => {
    const res = await fetch("/api/topics");
    if (!res.ok) throw new Error("Failed to fetch topics");
    return res.json();
};