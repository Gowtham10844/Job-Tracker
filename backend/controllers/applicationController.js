// controllers/applicationController.js
import mongoose from 'mongoose';
import Application from '../models/Application.js';
import { mockApplications } from '../utils/mockStore.js';

// @desc    Get all applications for logged-in user with search, filter, and sorting
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res) => {
  try {
    const { search, status, jobType, workMode, sort } = req.query;
    const currentUserId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      const query = { userId: req.user._id };

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [{ companyName: searchRegex }, { jobRole: searchRegex }, { location: searchRegex }];
      }

      if (status && status !== 'All') query.status = status;
      if (jobType && jobType !== 'All') query.jobType = jobType;
      if (workMode && workMode !== 'All') query.workMode = workMode;

      let sortOption = { applicationDate: -1 };
      if (sort === 'oldest') sortOption = { applicationDate: 1 };
      else if (sort === 'company_asc') sortOption = { companyName: 1 };
      else if (sort === 'company_desc') sortOption = { companyName: -1 };
      else if (sort === 'interview_soonest') sortOption = { interviewDate: 1 };

      const applications = await Application.find(query).sort(sortOption);
      return res.status(200).json({
        success: true,
        count: applications.length,
        data: applications,
      });
    } else {
      // In-Memory Fallback
      let list = mockApplications.filter(
        app => app.userId.toString() === currentUserId
      );

      if (search && search.trim() !== '') {
        const term = search.trim().toLowerCase();
        list = list.filter(
          app =>
            app.companyName.toLowerCase().includes(term) ||
            app.jobRole.toLowerCase().includes(term) ||
            (app.location && app.location.toLowerCase().includes(term))
        );
      }

      if (status && status !== 'All') {
        list = list.filter(app => app.status === status);
      }
      if (jobType && jobType !== 'All') {
        list = list.filter(app => app.jobType === jobType);
      }
      if (workMode && workMode !== 'All') {
        list = list.filter(app => app.workMode === workMode);
      }

      if (sort === 'oldest') {
        list.sort((a, b) => new Date(a.applicationDate) - new Date(b.applicationDate));
      } else if (sort === 'company_asc') {
        list.sort((a, b) => a.companyName.localeCompare(b.companyName));
      } else if (sort === 'company_desc') {
        list.sort((a, b) => b.companyName.localeCompare(a.companyName));
      } else if (sort === 'interview_soonest') {
        list.sort((a, b) => {
          if (!a.interviewDate) return 1;
          if (!b.interviewDate) return -1;
          return new Date(a.interviewDate) - new Date(b.interviewDate);
        });
      } else {
        list.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
      }

      return res.status(200).json({
        success: true,
        count: list.length,
        data: list,
      });
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving job applications',
      error: error.message,
    });
  }
};

// @desc    Get a single application by ID
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid application ID format' });
      }

      const application = await Application.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Job application not found or unauthorized',
        });
      }

      return res.status(200).json({ success: true, data: application });
    } else {
      const application = mockApplications.find(
        app =>
          app._id.toString() === req.params.id.toString() &&
          app.userId.toString() === currentUserId
      );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Job application not found or unauthorized',
        });
      }

      return res.status(200).json({ success: true, data: application });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving application details',
      error: error.message,
    });
  }
};

// @desc    Create a new job application
// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res) => {
  try {
    const {
      companyName,
      jobRole,
      jobType,
      location,
      workMode,
      applicationDate,
      status,
      description,
      jobLink,
      notes,
      interviewDate,
      salary,
    } = req.body;

    if (!companyName || !jobRole) {
      return res.status(400).json({
        success: false,
        message: 'Company name and job role are required fields',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const application = await Application.create({
        userId: req.user._id,
        companyName,
        jobRole,
        jobType: jobType || 'Internship',
        location: location || 'Bangalore, India',
        workMode: workMode || 'On-site',
        applicationDate: applicationDate || Date.now(),
        status: status || 'Applied',
        description: description || '',
        jobLink: jobLink || '',
        notes: notes || '',
        interviewDate: interviewDate || null,
        salary: salary || '',
      });

      return res.status(201).json({
        success: true,
        message: 'Job application tracked successfully',
        data: application,
      });
    } else {
      const newMockApp = {
        _id: new mongoose.Types.ObjectId().toString(),
        userId: req.user._id.toString(),
        companyName,
        jobRole,
        jobType: jobType || 'Internship',
        location: location || 'Bangalore, India',
        workMode: workMode || 'On-site',
        applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
        status: status || 'Applied',
        description: description || '',
        jobLink: jobLink || '',
        notes: notes || '',
        interviewDate: interviewDate ? new Date(interviewDate) : null,
        salary: salary || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockApplications.unshift(newMockApp);

      return res.status(201).json({
        success: true,
        message: 'Job application tracked successfully',
        data: newMockApp,
      });
    }
  } catch (error) {
    console.error('Create Application Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to save job application',
    });
  }
};

// @desc    Update an existing application
// @route   PUT /api/applications/:id
// @access  Private
export const updateApplication = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid application ID format' });
      }

      let application = await Application.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Job application not found or unauthorized',
        });
      }

      const updated = await Application.findByIdAndUpdate(
        req.params.id,
        { ...req.body, userId: req.user._id },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Application updated successfully',
        data: updated,
      });
    } else {
      const index = mockApplications.findIndex(
        app =>
          app._id.toString() === req.params.id.toString() &&
          app.userId.toString() === currentUserId
      );

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Job application not found or unauthorized',
        });
      }

      mockApplications[index] = {
        ...mockApplications[index],
        ...req.body,
        userId: currentUserId,
        updatedAt: new Date(),
      };

      return res.status(200).json({
        success: true,
        message: 'Application updated successfully',
        data: mockApplications[index],
      });
    }
  } catch (error) {
    console.error('Update Application Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update job application',
    });
  }
};

// @desc    Delete a job application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid application ID format' });
      }

      const application = await Application.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Job application not found or unauthorized',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Job application deleted successfully',
        data: { id: req.params.id },
      });
    } else {
      const index = mockApplications.findIndex(
        app =>
          app._id.toString() === req.params.id.toString() &&
          app.userId.toString() === currentUserId
      );

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Job application not found or unauthorized',
        });
      }

      mockApplications.splice(index, 1);

      return res.status(200).json({
        success: true,
        message: 'Job application deleted successfully',
        data: { id: req.params.id },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting job application',
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics and metrics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    let applications = [];

    if (mongoose.connection.readyState === 1) {
      applications = await Application.find({ userId: req.user._id });
    } else {
      applications = mockApplications.filter(
        app => app.userId.toString() === currentUserId
      );
    }

    const total = applications.length;
    let appliedCount = 0;
    let oaCount = 0;
    let interviewCount = 0;
    let offerCount = 0;
    let rejectedCount = 0;
    let withdrawnCount = 0;

    applications.forEach(app => {
      switch (app.status) {
        case 'Applied':
          appliedCount++;
          break;
        case 'Online Assessment':
          oaCount++;
          break;
        case 'Interview':
          interviewCount++;
          break;
        case 'Offer Received':
          offerCount++;
          break;
        case 'Rejected':
          rejectedCount++;
          break;
        case 'Withdrawn':
          withdrawnCount++;
          break;
        default:
          break;
      }
    });

    const now = new Date();
    const upcomingInterviews = applications
      .filter(app => app.interviewDate && new Date(app.interviewDate) >= new Date(now.setHours(0, 0, 0, 0)))
      .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
      .slice(0, 5);

    const recentApplications = [...applications]
      .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
      .slice(0, 5);

    const monthlyActivity = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthYear = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      const monthIndex = d.getMonth();

      const count = applications.filter(app => {
        const appDate = new Date(app.applicationDate);
        return appDate.getMonth() === monthIndex && appDate.getFullYear() === year;
      }).length;

      monthlyActivity.push({
        month: monthYear,
        applications: count,
      });
    }

    const statusDistribution = [
      { name: 'Applied', value: appliedCount, color: '#3B82F6' },
      { name: 'Online Assessment', value: oaCount, color: '#8B5CF6' },
      { name: 'Interview', value: interviewCount, color: '#F59E0B' },
      { name: 'Offer Received', value: offerCount, color: '#10B981' },
      { name: 'Rejected', value: rejectedCount, color: '#EF4444' },
      { name: 'Withdrawn', value: withdrawnCount, color: '#6B7280' },
    ].filter(item => item.value > 0);

    return res.status(200).json({
      success: true,
      stats: {
        total,
        applied: appliedCount,
        onlineAssessment: oaCount,
        interviews: interviewCount,
        offers: offerCount,
        rejected: rejectedCount,
        withdrawn: withdrawnCount,
        statusDistribution,
        monthlyActivity,
        upcomingInterviews,
        recentApplications,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while calculating dashboard statistics',
      error: error.message,
    });
  }
};

// @desc    Get interviews list (upcoming and past)
// @route   GET /api/interviews
// @access  Private
export const getInterviews = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const now = new Date();
    let interviews = [];

    if (mongoose.connection.readyState === 1) {
      interviews = await Application.find({
        userId: req.user._id,
        interviewDate: { $ne: null },
      }).sort({ interviewDate: 1 });
    } else {
      interviews = mockApplications
        .filter(app => app.userId.toString() === currentUserId && app.interviewDate)
        .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));
    }

    const upcoming = [];
    const past = [];

    interviews.forEach(item => {
      const date = new Date(item.interviewDate);
      if (date >= new Date(now.setHours(0, 0, 0, 0))) {
        upcoming.push(item);
      } else {
        past.push(item);
      }
    });

    return res.status(200).json({
      success: true,
      totalInterviews: interviews.length,
      upcoming,
      past,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving interview schedules',
      error: error.message,
    });
  }
};
