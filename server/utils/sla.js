const SLA_HOURS = {
  Low: 48,
  Medium: 24,
  High: 8,
  Urgent: 4,
};

const getSlaDueAt = (createdAt, priority) => {
  const hours = SLA_HOURS[priority] || SLA_HOURS.Medium;
  const created = new Date(createdAt);

  return new Date(created.getTime() + hours * 60 * 60 * 1000);
};

const isOverdue = (createdAt, priority, status) => {
  if (status === "Closed") return false;

  const dueAt = getSlaDueAt(createdAt, priority);

  return new Date() > dueAt;
};

module.exports = {
  SLA_HOURS,
  getSlaDueAt,
  isOverdue,
};