import 'package:flutter/material.dart';
import '../models/review.dart';
import '../services/storage_service.dart';
import '../services/sync_service.dart';
import 'confirmation_screen.dart';

// Profile, Amenities, Notes, Summary — consolidated navigation chain

class ProfileScreen extends StatefulWidget {
  final Review review;
  const ProfileScreen({super.key, required this.review});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late Review _review;
  int _step = 0;

  static const _profileFields = {
    'greenSpeed': ['Slow', 'Medium', 'Fast', 'Very Fast'],
    'difficulty': ['Easy', 'Moderate', 'Challenging', 'Very Difficult'],
  };

  static const _amenities = [
    'Snack Bar', 'Grill', 'Restaurant', 'Full Range', 'Putting Green',
  ];

  @override
  void initState() {
    super.initState();
    _review = widget.review.recalculate(StorageService.instance.scoreConfig);
  }

  Future<void> _save() async {
    await StorageService.instance.upsertReview(_review);
  }

  @override
  Widget build(BuildContext context) {
    if (_step == 0) return _buildProfile();
    if (_step == 1) return _buildAmenities();
    if (_step == 2) return _buildNotes();
    return _buildSummary();
  }

  Widget _buildProfile() {
    return Scaffold(
      appBar: AppBar(title: const Text('Descriptive Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ..._profileFields.entries.map((e) => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(e.key, style: const TextStyle(fontWeight: FontWeight.bold)),
                  Wrap(
                    spacing: 8,
                    children: e.value.map((opt) {
                      final selected = _review.descriptiveProfile[e.key] == opt;
                      return ChoiceChip(
                        label: Text(opt),
                        selected: selected,
                        onSelected: (_) {
                          final profile = Map<String, String>.from(_review.descriptiveProfile);
                          profile[e.key] = selected ? '' : opt;
                          setState(() => _review = _review.copyWith(descriptiveProfile: profile));
                          _save();
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 12),
                ],
              )),
          FilledButton(onPressed: () => setState(() => _step = 1), child: const Text('Amenities')),
        ],
      ),
    );
  }

  Widget _buildAmenities() {
    return Scaffold(
      appBar: AppBar(title: const Text('Amenities')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 8,
            children: _amenities.map((a) {
              final selected = _review.amenities.contains(a);
              return FilterChip(
                label: Text(a),
                selected: selected,
                onSelected: (_) {
                  final list = List<String>.from(_review.amenities);
                  if (selected) {
                    list.remove(a);
                  } else {
                    list.add(a);
                  }
                  setState(() => _review = _review.copyWith(amenities: list));
                  _save();
                },
              );
            }).toList(),
          ),
          FilledButton(onPressed: () => setState(() => _step = 2), child: const Text('Notes')),
        ],
      ),
    );
  }

  Widget _buildNotes() {
    return Scaffold(
      appBar: AppBar(title: const Text('Notes')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              decoration: const InputDecoration(labelText: 'Best Thing'),
              onChanged: (v) {
                final notes = Map<String, String>.from(_review.notes);
                notes['bestThing'] = v;
                _review = _review.copyWith(notes: notes);
                _save();
              },
            ),
            FilledButton(
              onPressed: () => setState(() => _step = 3),
              child: const Text('Summary'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummary() {
    return Scaffold(
      appBar: AppBar(title: const Text('Review Summary')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(_review.courseInfo.courseName,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            Text('Score: ${_review.weightedScore.toStringAsFixed(1)} (${_review.letterGrade})'),
            const Spacer(),
            FilledButton(
              onPressed: () async {
                await SyncService.instance.submitReview(_review);
                if (!mounted) return;
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => const ConfirmationScreen()),
                );
              },
              child: const Text('Submit Review'),
            ),
          ],
        ),
      ),
    );
  }
}
