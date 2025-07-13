const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// 🔧 Helper: Generate punishment based on type and severity
const generatePunishment = (complaintType, severityLevel) => {
  if (severityLevel === 'Nuclear' || severityLevel === 'Major') {
    switch (complaintType) {
      case 'Cleanliness': return "You're responsible for cleaning the entire common area for a week!";
      case 'Noise': return "You owe everyone samosas and a silent night.";
      case 'Bills': return "You're covering the next month's internet bill.";
      case 'Pets': return "You're on pet-sitting duty for a month and buying new toys.";
      default: return "This serious issue requires a group discussion.";
    }
  } else if (severityLevel === 'Annoying') {
    switch (complaintType) {
      case 'Cleanliness': return "You're making chai for everyone for a week.";
      case 'Noise': return "You're treating everyone to coffee.";
      case 'Bills': return "You're doing grocery duty next week.";
      case 'Pets': return "You're organizing a pet playdate.";
      default: return "A small gesture of apology is expected.";
    }
  } else if (severityLevel === 'Mild') {
    return "A gentle reminder to be more mindful next time!";
  }
  return "No specific punishment suggested.";
};

// ✅ GET /api/complaints/all-flat — All complaints (global)
router.get('/all-flat', protect, asyncHandler(async (req, res) => {
  const complaints = await Complaint.find()
    .populate('filedBy', 'name flatCode')
    .sort({ createdAt: -1 });

  res.status(200).json(complaints);
}));

// ✅ GET /api/complaints — Only unresolved complaints in same flat
router.get('/', protect, asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({
    flatCode: req.user.flatCode,
    resolved: false,
  })
    .populate('filedBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(complaints);
}));

// ✅ POST /api/complaints — Create new complaint
router.post('/', protect, asyncHandler(async (req, res) => {
  const { title, description, complaintType, severityLevel } = req.body;
  if (!title || !description || !complaintType || !severityLevel) {
    res.status(400);
    throw new Error('Please fill all required complaint fields');
  }

  const complaint = await Complaint.create({
    title,
    description,
    complaintType,
    severityLevel,
    filedBy: req.user._id,
    flatCode: req.user.flatCode,
  });

  res.status(201).json(complaint);
}));

// ✅ PUT /api/complaints/:id/resolve — Mark complaint as resolved
router.put('/:id/resolve', protect, asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  if (complaint.resolved) {
    res.status(400);
    throw new Error('Already resolved');
  }

  complaint.resolved = true;
  complaint.resolvedBy = req.user._id;
  complaint.resolvedAt = new Date();
  await complaint.save();

  await User.findByIdAndUpdate(req.user._id, { $inc: { karmaPoints: 10 } });

  res.json({ message: 'Complaint resolved', complaint });
}));

// ✅ POST /api/complaints/:id/vote — Upvote/Downvote (no flat restriction)
router.post('/:id/vote', protect, asyncHandler(async (req, res) => {
  const { voteType } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  const userId = req.user._id;

  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  if (complaint.filedBy.toString() === userId.toString()) {
    res.status(400);
    throw new Error('You cannot vote on your own complaint.');
  }

  const hasUpvoted = complaint.upvotedBy.includes(userId);
  const hasDownvoted = complaint.downvotedBy.includes(userId);

  if (voteType === 'upvote') {
    if (hasUpvoted) throw new Error('Already upvoted.');
    if (hasDownvoted) {
      complaint.downvotes--;
      complaint.downvotedBy.pull(userId);
      complaint.downvotedAt = null;
    }
    complaint.upvotes++;
    complaint.upvotedBy.push(userId);
  } else if (voteType === 'downvote') {
    if (hasDownvoted) throw new Error('Already downvoted.');
    if (hasUpvoted) {
      complaint.upvotes--;
      complaint.upvotedBy.pull(userId);
    }
    complaint.downvotes++;
    complaint.downvotedBy.push(userId);
    if (!complaint.downvotedAt) complaint.downvotedAt = new Date();
  } else {
    res.status(400);
    throw new Error('Invalid vote type.');
  }

  // Handle punishment suggestion
  if (complaint.upvotes >= 10 && !complaint.suggestedPunishment) {
    complaint.suggestedPunishment = generatePunishment(complaint.complaintType, complaint.severityLevel);
  } else if (complaint.upvotes < 10 && complaint.suggestedPunishment) {
    complaint.suggestedPunishment = null;
  }

  await complaint.save();
  res.json({ message: 'Vote recorded', complaint });
}));

// ✅ GET /api/complaints/resolved — Only resolved complaints
router.get('/resolved', protect, asyncHandler(async (req, res) => {
  const resolvedComplaints = await Complaint.find({ resolved: true })
    .populate('filedBy', 'name flatCode')
    .sort({ resolvedAt: -1 });

  res.json(resolvedComplaints);
}));

// ✅ GET /api/complaints/trending — Top 5 unresolved complaints (same flat only)
router.get('/trending', protect, asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({
    flatCode: req.user.flatCode,
    resolved: false,
    upvotes: { $gt: 0 },
  })
    .populate('filedBy', 'name')
    .sort({ upvotes: -1, createdAt: -1 })
    .limit(5);

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const filtered = complaints.filter(c =>
    !(c.downvotes > 0 && c.downvotedAt && c.downvotedAt <= threeDaysAgo)
  );

  res.json(filtered);
}));

module.exports = router;
