const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateDistrict } = require('../middleware/validationMiddleware');

/**
 * @swagger
 * /api/districts:
 *   get:
 *     summary: Get all districts
 *     tags: [Districts]
 *     responses:
 *       200:
 *         description: List of districts
 */
router.get('/', districtController.getDistricts);

/**
 * @swagger
 * /api/districts/{id}:
 *   get:
 *     summary: Get district by ID
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: District details
 *       404:
 *         description: District not found
 */
router.get('/:id', districtController.getDistrictById);

/**
 * @swagger
 * /api/districts/{id}/venues:
 *   get:
 *     summary: Get venues in a district
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of venues in the district
 *       404:
 *         description: District not found
 */
router.get('/:id/venues', districtController.getDistrictVenues);

/**
 * @swagger
 * /api/districts:
 *   post:
 *     summary: Create a new district
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: District created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.post('/', protect, authorize('admin'), validateDistrict, districtController.createDistrict);

/**
 * @swagger
 * /api/districts/{id}:
 *   put:
 *     summary: Update district
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: District updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: District not found
 */
router.put('/:id', protect, authorize('admin'), validateDistrict, districtController.updateDistrict);

/**
 * @swagger
 * /api/districts/{id}:
 *   delete:
 *     summary: Delete district
 *     tags: [Districts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: District deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: District not found
 */
router.delete('/:id', protect, authorize('admin'), districtController.deleteDistrict);

module.exports = router;