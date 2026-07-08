import { useState, useEffect } from "react";

const EMOJI_OPTIONS = ["🏃", "📚", "💧", "🧘", "🥗", "💤", "✍️", "🎯", "🌿", "💪"];
const COLOR_OPTIONS = [
  { name: "sage", bg: "#4a7c59", light: "#e8f0eb", text: "#2d4f38" },
  { name: "clay", bg: "#b5634a", light: "#f5e8e4", text: "#6b3425" },
  { name: "indigo", bg: "#4a5fa8", light: "#e8ebf7", text: "#2c3870" },
  { name: "amber", bg: "#c49a3c", light: "#f7f0e0", text: "#6b5015" },
  { name: "rose", bg: "#b5506a", light: "#f5e4ea", text: "#6b2d40" },
  { name: "teal", bg: "#3a8a8a", light: "#e0f0f0", text: "#1e5050" },
];

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

const defaultHabits = [
  { id: 1, name: "Пить воду", emoji: "💧", color: COLOR_OPTIONS[5], completions: {} },
  { id: 2, name: "Читать книгу", emoji: "📚", color: COLOR_OPTIONS[2], completions: {} },
  { id: 3, name: "Прогулка", emoji: "🏃", color: COLOR_OPTIONS[0], completions: {} },
];

export default function HabitTracker() {
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem("mora-habits");
      return saved ? JSON.parse(saved) : defaultHabits;
    } catch { return defaultHabits; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎯");
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0]);
  const [activeView, setActiveView] = useState("today");
  const [deletingId, setDeletingId] = useState(null);

  const weekDates = getWeekDates();
  const today = getTodayStr();

  useEffect(() => {
    try { localStorage.setItem("mora-habits", JSON.stringify(habits)); } catch {}
  }, [habits]);

  function toggleDay(habitId, date) {
    setHabits(h => h.map(habit =>
      habit.id === habitId
        ? { ...habit, completions: { ...habit.completions, [date]: !habit.completions[date] } }
        : habit
    ));
  }

  function addHabit() {
    if (!newName.trim()) return;
    setHabits(h => [...h, {
      id: Date.now(), name: newName.trim(), emoji: newEmoji,
      color: newColor, completions: {}
    }]);
    setNewName(""); setNewEmoji("🎯"); setNewColor(COLOR_OPTIONS[0]);
    setShowAdd(false);
  }

  function deleteHabit(id) {
    setHabits(h => h.filter(habit => habit.id !== id));
    setDeletingId(null);
  }

  function getWeekScore(habit) {
    return weekDates.filter(d => habit.completions[d]).length;
  }

  function getTodayCompleted() {
    return habits.filter(h => h.completions[today]).length;
  }

  const totalToday = habits.length;
  const doneToday = getTodayCompleted();
  const overallPercent = totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0;

  const styles = {
    app: {
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#f7f5f0",
      minHeight: "100vh",
      padding: "0",
    },
    header: {
      background: "#1a1a2e",
      padding: "1.5rem 2rem 1rem",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    headerTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "1rem",
    },
    logo: {
      fontFamily: "'Georgia', serif",
      fontSize: "1.4rem",
      fontWeight: "400",
      color: "#e8e4dc",
      letterSpacing: "0.12em",
      margin: 0,
    },
    dateStr: {
      fontSize: "0.72rem",
      color: "#9990b8",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginTop: "0.2rem",
    },
    addBtn: {
      background: "#4a5fa8",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      fontSize: "1.3rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
    },
    progressBar: {
      height: "4px",
      background: "rgba(255,255,255,0.1)",
      borderRadius: "2px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #4a5fa8, #7b8fd4)",
      borderRadius: "2px",
      transition: "width 0.6s ease",
      width: `${overallPercent}%`,
    },
    progressLabel: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "0.4rem",
      fontSize: "0.75rem",
      color: "#9990b8",
    },
    tabs: {
      display: "flex",
      gap: "0",
      background: "rgba(255,255,255,0.06)",
      borderRadius: "8px",
      padding: "3px",
      marginTop: "1rem",
    },
    tab: (active) => ({
      flex: 1,
      padding: "0.45rem",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.78rem",
      cursor: "pointer",
      transition: "all 0.2s",
      background: active ? "#fff" : "transparent",
      color: active ? "#1a1a2e" : "#9990b8",
      fontWeight: active ? "500" : "400",
    }),
    content: { padding: "1.25rem 1.25rem 6rem" },
    habitCard: (color) => ({
      background: "#fff",
      borderRadius: "14px",
      padding: "1rem 1.1rem",
      marginBottom: "0.75rem",
      borderLeft: `4px solid ${color.bg}`,
      position: "relative",
    }),
    habitRow: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    emojiCircle: (color) => ({
      width: "38px",
      height: "38px",
      borderRadius: "10px",
      background: color.light,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.1rem",
      flexShrink: 0,
    }),
    habitName: {
      fontSize: "0.95rem",
      fontWeight: "500",
      color: "#1a1a2e",
      flex: 1,
    },
    checkBtn: (done, color) => ({
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      border: done ? "none" : `2px solid #ddd`,
      background: done ? color.bg : "transparent",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.85rem",
      transition: "all 0.2s",
      flexShrink: 0,
    }),
    weekGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "4px",
      marginTop: "0.75rem",
    },
    dayCell: (done, isToday, color) => ({
      borderRadius: "6px",
      padding: "0.3rem 0",
      textAlign: "center",
      fontSize: "0.62rem",
      fontWeight: isToday ? "600" : "400",
      background: done ? color.bg : isToday ? color.light : "#f3f1ed",
      color: done ? "#fff" : isToday ? color.text : "#aaa",
      transition: "all 0.15s",
      cursor: "pointer",
      userSelect: "none",
    }),
    streakBadge: (color) => ({
      fontSize: "0.68rem",
      padding: "2px 8px",
      borderRadius: "20px",
      background: color.light,
      color: color.text,
      fontWeight: "500",
    }),
    modal: {
      position: "fixed",
      inset: 0,
      background: "rgba(26,26,46,0.7)",
      zIndex: 100,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
    },
    modalBox: {
      background: "#fff",
      borderRadius: "20px 20px 0 0",
      padding: "1.5rem",
      width: "100%",
      maxWidth: "480px",
    },
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "10px",
      border: "1.5px solid #e5e0d8",
      fontSize: "0.95rem",
      fontFamily: "inherit",
      outline: "none",
      marginBottom: "1rem",
      boxSizing: "border-box",
    },
    emojiGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "1rem",
    },
    emojiBtn: (selected) => ({
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      border: selected ? "2px solid #4a5fa8" : "1.5px solid #e5e0d8",
      background: selected ? "#e8ebf7" : "#f7f5f0",
      fontSize: "1.1rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    colorGrid: {
      display: "flex",
      gap: "8px",
      marginBottom: "1.25rem",
    },
    colorDot: (color, selected) => ({
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      background: color.bg,
      cursor: "pointer",
      border: selected ? `3px solid #1a1a2e` : "3px solid transparent",
      outline: selected ? `2px solid ${color.bg}` : "none",
      outlineOffset: "2px",
    }),
    saveBtn: {
      width: "100%",
      padding: "0.85rem",
      background: "#1a1a2e",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontSize: "0.9rem",
      fontWeight: "500",
      cursor: "pointer",
      fontFamily: "inherit",
    },
    cancelBtn: {
      width: "100%",
      padding: "0.7rem",
      background: "transparent",
      color: "#999",
      border: "none",
      borderRadius: "12px",
      fontSize: "0.85rem",
      cursor: "pointer",
      marginTop: "0.5rem",
      fontFamily: "inherit",
    },
    statCards: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.75rem",
      marginBottom: "1.25rem",
    },
    statCard: (color) => ({
      background: "#fff",
      borderRadius: "14px",
      padding: "1rem",
      textAlign: "center",
      borderTop: `3px solid ${color || "#e5e0d8"}`,
    }),
    statNum: { fontSize: "1.8rem", fontWeight: "600", color: "#1a1a2e", lineHeight: 1 },
    statLabel: { fontSize: "0.72rem", color: "#999", marginTop: "0.3rem", textTransform: "uppercase", letterSpacing: "0.08em" },
    weekChart: {
      background: "#fff",
      borderRadius: "14px",
      padding: "1.1rem",
      marginBottom: "0.75rem",
    },
    barRow: {
      display: "flex",
      alignItems: "flex-end",
      gap: "6px",
      height: "80px",
      marginTop: "1rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem 1rem",
      color: "#bbb",
    },
    sectionTitle: {
      fontSize: "0.72rem",
      fontWeight: "600",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#999",
      marginBottom: "0.75rem",
    },
    deleteBtn: {
      position: "absolute",
      top: "0.7rem",
      right: "0.7rem",
      background: "none",
      border: "none",
      color: "#ddd",
      cursor: "pointer",
      fontSize: "0.9rem",
      padding: "2px 6px",
      borderRadius: "6px",
    },
  };

  const today_display = new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });

  function calcStreak(habit) {
    let streak = 0;
    const d = new Date();
    while (true) {
      const s = d.toISOString().split("T")[0];
      if (habit.completions[s]) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  }

  function getWeeklyData() {
    return weekDates.map(date => ({
      date,
      count: habits.filter(h => h.completions[date]).length,
      label: DAYS[weekDates.indexOf(date)],
      isToday: date === today,
    }));
  }

  const weeklyData = getWeeklyData();
  const maxCount = Math.max(1, ...weeklyData.map(d => d.count));

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <p style={styles.logo}>HABITS</p>
            <p style={styles.dateStr}>{today_display}</p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowAdd(true)}>+</button>
        </div>
        <div style={styles.progressLabel}>
          <span>Сегодня выполнено</span>
          <span style={{ color: "#e8e4dc", fontWeight: "600" }}>{doneToday}/{totalToday}</span>
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill} />
        </div>
        <div style={styles.tabs}>
          <button style={styles.tab(activeView === "today")} onClick={() => setActiveView("today")}>Сегодня</button>
          <button style={styles.tab(activeView === "week")} onClick={() => setActiveView("week")}>Неделя</button>
          <button style={styles.tab(activeView === "stats")} onClick={() => setActiveView("stats")}>Итоги</button>
        </div>
      </div>

      <div style={styles.content}>
        {activeView === "today" && (
          <>
            {habits.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🌱</div>
                <p style={{ fontSize: "0.95rem", marginBottom: "0.5rem", color: "#888" }}>Нет привычек</p>
                <p style={{ fontSize: "0.8rem", color: "#bbb" }}>Нажмите + чтобы добавить первую привычку</p>
              </div>
            ) : habits.map(habit => {
              const done = !!habit.completions[today];
              return (
                <div key={habit.id} style={styles.habitCard(habit.color)}>
                  {deletingId === habit.id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.82rem", color: "#888" }}>Удалить привычку?</span>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => deleteHabit(habit.id)} style={{ ...styles.saveBtn, width: "auto", padding: "0.4rem 0.9rem", fontSize: "0.8rem", background: "#c0392b", borderRadius: "8px" }}>Да</button>
                        <button onClick={() => setDeletingId(null)} style={{ ...styles.cancelBtn, width: "auto", padding: "0.4rem 0.9rem", border: "1.5px solid #ddd", borderRadius: "8px", margin: 0 }}>Нет</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button style={styles.deleteBtn} onClick={() => setDeletingId(habit.id)}>×</button>
                      <div style={styles.habitRow}>
                        <div style={styles.emojiCircle(habit.color)}>{habit.emoji}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ ...styles.habitName, textDecoration: done ? "line-through" : "none", color: done ? "#aaa" : "#1a1a2e" }}>{habit.name}</p>
                          {calcStreak(habit) > 1 && (
                            <span style={styles.streakBadge(habit.color)}>🔥 {calcStreak(habit)} дня подряд</span>
                          )}
                        </div>
                        <button style={styles.checkBtn(done, habit.color)} onClick={() => toggleDay(habit.id, today)}>
                          {done ? <span style={{ color: "#fff", fontSize: "0.85rem" }}>✓</span> : null}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}

        {activeView === "week" && (
          <>
            <p style={styles.sectionTitle}>Прогресс за неделю</p>
            {habits.length === 0 ? (
              <div style={styles.emptyState}><div style={{ fontSize: "2rem" }}>📊</div><p style={{ color: "#bbb", marginTop: "0.5rem" }}>Нет привычек</p></div>
            ) : (
              <>
                <div style={styles.weekChart}>
                  <p style={{ fontSize: "0.78rem", fontWeight: "600", color: "#1a1a2e", marginBottom: "0.25rem" }}>Выполнено привычек</p>
                  <p style={{ fontSize: "0.72rem", color: "#aaa" }}>всего привычек: {habits.length}</p>
                  <div style={styles.barRow}>
                    {weeklyData.map((d, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                        <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                          <div style={{
                            width: "100%",
                            height: `${(d.count / maxCount) * 100}%`,
                            minHeight: d.count > 0 ? "8px" : "4px",
                            background: d.isToday ? "#4a5fa8" : d.count > 0 ? "#b5d4f4" : "#f0ece6",
                            borderRadius: "5px 5px 0 0",
                            transition: "height 0.4s ease",
                          }} />
                        </div>
                        <p style={{ fontSize: "0.65rem", color: d.isToday ? "#4a5fa8" : "#bbb", marginTop: "5px", fontWeight: d.isToday ? "700" : "400" }}>{d.label}</p>
                        {d.count > 0 && <p style={{ fontSize: "0.65rem", color: "#888" }}>{d.count}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {habits.map(habit => {
                  const score = getWeekScore(habit);
                  return (
                    <div key={habit.id} style={styles.habitCard(habit.color)}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.7rem" }}>
                        <span style={{ fontSize: "1rem" }}>{habit.emoji}</span>
                        <span style={styles.habitName}>{habit.name}</span>
                        <span style={styles.streakBadge(habit.color)}>{score}/7</span>
                      </div>
                      <div style={styles.weekGrid}>
                        {weekDates.map((date, i) => (
                          <div key={date} style={styles.dayCell(habit.completions[date], date === today, habit.color)}
                            onClick={() => toggleDay(habit.id, date)}>
                            {DAYS[i]}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}

        {activeView === "stats" && (
          <>
            <p style={styles.sectionTitle}>Ваша статистика</p>
            <div style={styles.statCards}>
              <div style={styles.statCard("#4a5fa8")}>
                <p style={styles.statNum}>{doneToday}</p>
                <p style={styles.statLabel}>Сегодня</p>
              </div>
              <div style={styles.statCard("#4a7c59")}>
                <p style={styles.statNum}>{habits.length}</p>
                <p style={styles.statLabel}>Привычек</p>
              </div>
              <div style={styles.statCard("#c49a3c")}>
                <p style={styles.statNum}>{weeklyData.reduce((s, d) => s + d.count, 0)}</p>
                <p style={styles.statLabel}>За неделю</p>
              </div>
              <div style={styles.statCard("#b5634a")}>
                <p style={styles.statNum}>{Math.max(0, ...habits.map(calcStreak))}</p>
                <p style={styles.statLabel}>Макс. серия</p>
              </div>
            </div>

            <p style={{ ...styles.sectionTitle, marginTop: "1rem" }}>Лучшие привычки</p>
            {[...habits].sort((a, b) => getWeekScore(b) - getWeekScore(a)).map(habit => {
              const pct = Math.round((getWeekScore(habit) / 7) * 100);
              return (
                <div key={habit.id} style={{ background: "#fff", borderRadius: "12px", padding: "0.9rem 1rem", marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                    <span>{habit.emoji}</span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "500", flex: 1 }}>{habit.name}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: "600", color: habit.color.text }}>{pct}%</span>
                  </div>
                  <div style={{ height: "5px", background: "#f0ece6", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: habit.color.bg, borderRadius: "3px", transition: "width 0.5s ease" }} />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {showAdd && (
        <div style={styles.modal} onClick={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div style={styles.modalBox}>
            <p style={{ fontWeight: "600", fontSize: "1rem", marginBottom: "1rem", color: "#1a1a2e" }}>Новая привычка</p>
            <input style={styles.input} placeholder="Название привычки..." value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addHabit(); }} autoFocus />
            <p style={{ fontSize: "0.75rem", color: "#999", marginBottom: "0.5rem" }}>Выбери иконку</p>
            <div style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map(em => (
                <button key={em} style={styles.emojiBtn(em === newEmoji)} onClick={() => setNewEmoji(em)}>{em}</button>
              ))}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#999", marginBottom: "0.5rem" }}>Цвет</p>
            <div style={styles.colorGrid}>
              {COLOR_OPTIONS.map(c => (
                <div key={c.name} style={styles.colorDot(c, c.name === newColor.name)} onClick={() => setNewColor(c)} />
              ))}
            </div>
            <button style={styles.saveBtn} onClick={addHabit}>Добавить привычку</button>
            <button style={styles.cancelBtn} onClick={() => setShowAdd(false)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
}
